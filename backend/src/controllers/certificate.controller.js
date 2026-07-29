/**
 * certificate.controller.js
 *
 * generateCertificate assumes `authenticate` + `authorize(OFFICER, ADMIN)`
 * have run. downloadCertificate assumes `authenticate` only — the
 * owner-or-staff check happens inside certificate.service.js.
 * verifyCertificate is fully public (no auth middleware at all).
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs/promises');

const applicationModel = require('../models/application.model');
const certificateModel = require('../models/certificate.model');
const auditLogModel = require('../models/auditLog.model');
const certificateService = require('../services/certificate.service');
const pdfService = require('../services/pdf.service');
const qrcodeService = require('../services/qrcode.service');
const config = require('../config/env.config');
const AppError = require('../utils/AppError');
const { success } = require('../utils/responseFormatter');
const { AUDIT_ACTIONS } = require('../utils/constants');

/**
 * POST /api/certificates/applications/:applicationId/generate
 *
 * Approve-to-certificate workflow: takes an application that an
 * officer has already approved (Module 6) and issues a certificate —
 * PDF + QR code generated and written to disk, application status
 * moved to 'certificate_issued', certificate row created — with the
 * status flip and the certificate row committed together atomically.
 */
async function generateCertificate(req, res, next) {
  let pdfAbsolutePath = null;

  try {
    const { applicationId } = req.params;

    const application = await applicationModel.findByIdAny(applicationId);
    certificateService.assertApplicationReadyForCertificate(application);

    // Defensive pre-check (fast, friendly error) — the transaction
    // below is the actual source of truth against a concurrent request.
    const existingCertificate = await certificateModel.findByApplicationId(applicationId);
    if (existingCertificate) {
      throw new AppError('A certificate already exists for this application.', 409);
    }

    const certificateId = crypto.randomUUID();
    const certificateNumber = certificateService.generateCertificateNumber();
    const verificationUrl = certificateService.buildVerificationUrl(certificateId);
    const qrCodePng = await qrcodeService.generateQrCodePng(verificationUrl);

    const fileName = `${certificateNumber}.pdf`;
    const relativePath = path.join(config.storage.certificateDir, fileName);
    pdfAbsolutePath = path.resolve(process.cwd(), relativePath);

    await pdfService.generateCertificatePdf({
      outputPath: pdfAbsolutePath,
      certificateNumber,
      applicantName: application.applicant_name,
      purpose: application.purpose,
      issuedAt: new Date(),
      qrCodePng,
    });

    const { application: updatedApplication, certificate } = await certificateModel.issueWithTransaction({
      applicationId,
      certificateId,
      certificateNumber,
      filePath: relativePath,
      qrCodeValue: verificationUrl,
      issuedBy: req.user.id,
    });

    if (!certificate) {
      // Lost the race to a concurrent request between our checks above
      // and the transaction — clean up the PDF we already wrote so
      // nothing orphaned is left on disk.
      await fs.unlink(pdfAbsolutePath).catch(() => {});
      throw new AppError('Certificate could not be issued — the application is no longer in an approved state.', 409);
    }

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.CERTIFICATE_GENERATED,
      entityType: 'certificate',
      entityId: certificate.id,
      metadata: { applicationId, certificateNumber: certificate.certificate_number },
      ipAddress: req.ip,
    });

    return success(res, {
      statusCode: 201,
      message: 'Certificate generated successfully.',
      data: { certificate, application: updatedApplication },
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/certificates/:certificateId/download
 * Streams the certificate PDF. Applicants may only download their
 * own certificate; officers/admins may download any.
 */
async function downloadCertificate(req, res, next) {
  try {
    const certificate = await certificateModel.findByIdWithApplication(req.params.certificateId);
    certificateService.assertDownloadAccess(certificate, req.user);

    const absolutePath = path.resolve(process.cwd(), certificate.file_path);
    try {
      await fs.access(absolutePath);
    } catch {
      throw new AppError('The certificate file could not be found on the server.', 500);
    }

    await auditLogModel.record({
      actorId: req.user.id,
      action: AUDIT_ACTIONS.CERTIFICATE_DOWNLOADED,
      entityType: 'certificate',
      entityId: certificate.id,
      metadata: { certificateNumber: certificate.certificate_number },
      ipAddress: req.ip,
    });

    return res.download(absolutePath, `${certificate.certificate_number}.pdf`, (err) => {
      if (err) next(err);
    });
  } catch (err) {
    return next(err);
  }
}

/**
 * GET /api/certificates/verify/:certificateId
 * Public endpoint (no authentication) — this is what the QR code
 * embedded in the certificate PDF links to. Returns only the limited
 * fields appropriate for a public checker; never the server file
 * path or any internal-only data.
 */
async function verifyCertificate(req, res, next) {
  try {
    const certificate = await certificateModel.findByIdWithApplication(req.params.certificateId);

    await auditLogModel.record({
      actorId: null,
      action: AUDIT_ACTIONS.CERTIFICATE_VERIFIED,
      entityType: 'certificate',
      entityId: certificate ? certificate.id : null,
      metadata: { certificateId: req.params.certificateId, result: certificate ? certificate.status : 'not_found' },
      ipAddress: req.ip,
    });

    if (!certificate) {
      return success(res, {
        message: 'No certificate found for the provided id.',
        data: { isValid: false },
      });
    }

    return success(res, {
      message: 'Certificate verification result.',
      data: certificateService.toPublicVerificationView(certificate),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { generateCertificate, downloadCertificate, verifyCertificate };
