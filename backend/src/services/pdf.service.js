/**
 * pdf.service.js
 *
 * Re-exports the certificate PDF generator from src/utils/certificate.pdf.
 * Preserves the existing exports (generateCertificatePdf, PROTOTYPE_NOTICE)
 * for backward compatibility with no duplicated implementation.
 */

const { generateCertificatePdf, PROTOTYPE_NOTICE } = require('../utils/certificate.pdf');

module.exports = {
  generateCertificatePdf,
  PROTOTYPE_NOTICE,
};
