/**
 * generateFilename.js
 *
 * Produces a random, collision-resistant filename for a stored
 * upload, decoupled entirely from the user-supplied original name.
 * This prevents path traversal, filename collisions, and any
 * injection via a crafted original filename — the original name is
 * kept only as metadata (documents.original_file_name), never used
 * to build a filesystem path.
 */

const crypto = require('crypto');

const EXTENSION_BY_MIME_TYPE = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
};

/**
 * @param {string} mimeType - validated MIME type of the uploaded file
 * @returns {string} a safe filename, e.g. "3f9a1c2e7b4d4a9f8c1e2a7b6d5f4e3c.pdf"
 */
function generateSecureFilename(mimeType) {
  const extension = EXTENSION_BY_MIME_TYPE[mimeType] || '';
  const randomName = crypto.randomBytes(16).toString('hex');
  return `${randomName}${extension}`;
}

module.exports = generateSecureFilename;
