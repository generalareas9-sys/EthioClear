/**
 * upload.middleware.js
 *
 * Wraps the configured Multer instance so its errors (wrong file
 * type, file too large, no file provided) are converted into the
 * app's standard error response shape via AppError, instead of
 * leaking a raw Multer/Node error to the client.
 */

const multer = require('multer');
const upload = require('../config/multer.config');
const config = require('../config/env.config');
const AppError = require('../utils/AppError');

function uploadSingleDocument(req, res, next) {
  upload.single('document')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError(`File exceeds the maximum allowed size of ${config.storage.maxUploadSizeMb}MB.`, 400));
      }
      return next(new AppError(`Upload error: ${err.message}`, 400));
    }
    if (err && err.message === 'UNSUPPORTED_FILE_TYPE') {
      return next(new AppError('Only PDF, JPEG, and PNG files are allowed.', 400));
    }
    if (err) {
      return next(err);
    }
    if (!req.file) {
      return next(new AppError('A document file is required.', 400));
    }
    return next();
  });
}

module.exports = { uploadSingleDocument };
