/**
 * multer.config.js
 *
 * Configures Multer's disk storage engine for document uploads:
 * - Files are written to config.storage.uploadDir (storage/uploads/).
 * - Filenames are generated securely (see utils/generateFilename.js)
 *   and never derived from user-supplied input.
 * - Only the MIME types allowed by the documents table's CHECK
 *   constraint (PDF, JPEG, PNG) are accepted.
 * - File size is capped per config.storage.maxUploadSizeMb.
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const config = require('./env.config');
const generateSecureFilename = require('../utils/generateFilename');
const { ALLOWED_DOCUMENT_MIME_TYPES } = require('../utils/constants');

const uploadDir = path.resolve(process.cwd(), config.storage.uploadDir);

// Ensure the upload directory exists at startup (storage/uploads/.gitkeep
// keeps it in git, but a fresh clone/deploy may still need this).
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, generateSecureFilename(file.mimetype));
  },
});

function fileFilter(req, file, cb) {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype)) {
    // Signal rejection via a recognizable error; upload.middleware.js
    // maps this to a clean 400 response rather than a raw stack trace.
    return cb(new Error('UNSUPPORTED_FILE_TYPE'), false);
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.storage.maxUploadSizeMb * 1024 * 1024,
    files: 1,
  },
});

module.exports = upload;
