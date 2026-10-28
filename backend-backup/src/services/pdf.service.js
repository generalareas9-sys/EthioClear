/**
 * pdf.service.js
 *
 * Renders the certificate PDF with PDFKit. The document is always
 * and unmistakably labeled as a prototype — this system does not,
 * and must never, produce anything resembling an authentic
 * government-issued certificate. See project rule #3: "All
 * certificates must be clearly marked 'Prototype' or 'For
 * Demonstration Purposes Only.'"
 */

const fs = require('fs');
const PDFDocument = require('pdfkit');

const PROTOTYPE_NOTICE = 'PROTOTYPE CERTIFICATE — FOR DEMONSTRATION PURPOSES ONLY — NOT A LEGAL DOCUMENT';

/**
 * @param {object} params
 * @param {string} params.outputPath - absolute path to write the PDF to
 * @param {string} params.certificateNumber
 * @param {string} params.applicantName
 * @param {string} params.purpose
 * @param {Date}   params.issuedAt
 * @param {Buffer} params.qrCodePng - PNG buffer of the verification QR code
 * @returns {Promise<void>} resolves once the file has been fully written
 */
function generateCertificatePdf({ outputPath, certificateNumber, applicantName, purpose, issuedAt, qrCodePng }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.on('error', reject);

    doc.pipe(stream);

    // ---- Top banner: unmistakable prototype notice ----
    doc
      .rect(0, 0, doc.page.width, 40)
      .fill('#B91C1C');
    doc
      .fillColor('#FFFFFF')
      .fontSize(11)
      .font('Helvetica-Bold')
      .text(PROTOTYPE_NOTICE, 0, 14, { align: 'center' });

    doc.moveDown(3);
    doc.fillColor('#000000');

    // ---- Header ----
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#1D4ED8') // blue — matches the approved UI palette
      .text('EthioClear', { align: 'center' });

    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#15803D') // green — matches the approved UI palette
      .text('Criminal Record Certificate (Academic Prototype)', { align: 'center' });

    doc.moveDown(2);
    doc.fillColor('#000000');

    // ---- Body ----
    const labelValue = (label, value) => {
      doc.font('Helvetica-Bold').fontSize(11).text(`${label}:`, { continued: true }).font('Helvetica').text(` ${value}`);
      doc.moveDown(0.5);
    };

    doc.fontSize(12).text('This document certifies that the individual below has an application record in the EthioClear demonstration system.', {
      align: 'left',
    });
    doc.moveDown(1.5);

    labelValue('Certificate Number', certificateNumber);
    labelValue('Applicant Name', applicantName);
    labelValue('Purpose', purpose);
    labelValue('Issued Date', issuedAt.toISOString().slice(0, 10));

    doc.moveDown(2);

    // ---- QR code (bottom-right) ----
    const qrSize = 120;
    const qrX = doc.page.width - doc.page.margins.right - qrSize;
    const qrY = doc.page.height - doc.page.margins.bottom - qrSize - 60;
    doc.image(qrCodePng, qrX, qrY, { width: qrSize, height: qrSize });
    doc
      .fontSize(9)
      .font('Helvetica')
      .text('Scan to verify (internal demo verification only)', qrX - 30, qrY + qrSize + 5, {
        width: qrSize + 60,
        align: 'center',
      });

    // ---- Footer notice (repeated for emphasis) ----
    doc
      .fontSize(9)
      .fillColor('#B91C1C')
      .text(PROTOTYPE_NOTICE, doc.page.margins.left, doc.page.height - doc.page.margins.bottom - 20, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right,
        align: 'center',
      });

    doc.end();
  });
}

module.exports = { generateCertificatePdf, PROTOTYPE_NOTICE };
