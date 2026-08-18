/**
 * qrcode.service.js
 *
 * Generates QR code images encoding a link to this system's own
 * internal verification route. The QR value NEVER points at an
 * external or government endpoint — see certificate.service.js for
 * how the verification URL is constructed.
 */

const QRCode = require('qrcode');

/**
 * @param {string} verificationUrl - text/URL to encode
 * @returns {Promise<Buffer>} PNG image buffer suitable for embedding in a PDF
 */
async function generateQrCodePng(verificationUrl) {
  return QRCode.toBuffer(verificationUrl, {
    type: 'png',
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 220,
  });
}

module.exports = { generateQrCodePng };
