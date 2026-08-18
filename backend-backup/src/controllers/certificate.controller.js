/**
 * certificate.controller.js
 *
 * generateCertificate: officer/admin only (route + authorize middleware).
 *   On success, creates an in-app notification for the applicant
 *   containing the certificate number and verification URL.
 *
 * downloadCertificate: officer/admin only (route + authorize + service).
 *   Applicants are blocked at the route layer before reaching this handler.
 *
 * verifyCertificate: fully public — no auth required.
 *   Returns only the public-safe fields from toPublicVerificationView().
 */

const crypto = require('crypto');
const path = require('path');
const fs = require('fs/promises');

const applicationModel = require('../models/application.model');
const certificateModel = require('../models/certificate.model');
const notificationModel = require('../models/notification.model');
const auditLogModel = require('../models/auditLog.model');
const certificateService = require('../services/certificate.service');
const pdfService = require('../services/pdf.service');
const qrcodeService = require('../services/qrcode.service');
const config = require('../config/env.config');
const AppError = require('../utils/AppError');
const { success } = require('../utils/responseFormatter');
const { AUDIT_ACTIONS } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * POST /api/certificates/applications/:applicationId/generate
 *
 * Officer/admin only. Generates certificate PDF + QR code, creates the
 * certificate record, and sends an in-app notification to the applicant
 * containing the certificate number and verification URL.
 * Notification failure is non-fatal — the certificate is already
 * committed; we log the error but do not roll back.
 */
async function generateCertificate(req, res, next) {
  let pdfAbsolutePath = null;

  try {
    const { applicationId } = req.params;

    const application = await applicationModel.findByIdAny(applicationId);
    certificateService.assertApplicationReadyForCertificate(application);

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

    // Send in-app notification to the applicant.
    // Non-fatal: if this fails (e.g. DB hiccup) the certificate is
    // already committed, so we log the error and continue rather than
    // returning a 500 that would confuse the officer.
    try {
      await notificationModel.create({
        userId: updatedApplication.applicant_id,
        type: 'status_update',
        title: 'Certificate Issued',
        message:
          `Your Criminal Record Certificate has been issued.\n\n` +
          `Certificate Number: ${certificate.certificate_number}\n\n` +
          `To verify your certificate, visit the Certificate Verification page and enter:\n` +
          `${verificationUrl}\n\n` +
          `This certificate is a demonstration prototype and is not a legal government document.`,
        relatedEntityType: 'certificate',
        relatedEntityId: certificate.id,
      });
    } catch (notifErr) {
      logger.error('Failed to create certificate notification for applicant', notifErr);
    }

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
 *
 * Officer/admin only — enforced at the route layer by
 * authorize(ROLES.OFFICER, ROLES.ADMIN) before this handler runs.
 * assertDownloadAccess provides additional defense-in-depth.
 * Applicants cannot reach this handler.
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
 *
 * Fully public — no authentication. Returns only the safe fields
 * from toPublicVerificationView(); never exposes file_path or
 * internal storage information.
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
