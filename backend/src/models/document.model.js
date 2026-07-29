/**
 * document.model.js
 *
 * Direct database access for the `documents` table.
 */

const { query } = require('../config/db.config');

async function createDocument({
  applicationId,
  documentType,
  fileName,
  originalFileName,
  filePath,
  mimeType,
  fileSizeBytes,
}) {
  const result = await query(
    `INSERT INTO documents (application_id, document_type, file_name, original_file_name, file_path, mime_type, file_size_bytes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, application_id, document_type, file_name, original_file_name, mime_type, file_size_bytes, status, uploaded_at`,
    [applicationId, documentType, fileName, originalFileName, filePath, mimeType, fileSizeBytes]
  );
  return result.rows[0];
}

async function findByApplicationId(applicationId) {
  const result = await query(
    `SELECT id, application_id, document_type, file_name, original_file_name, mime_type, file_size_bytes, status, uploaded_at
     FROM documents
     WHERE application_id = $1
     ORDER BY uploaded_at ASC`,
    [applicationId]
  );
  return result.rows;
}

module.exports = { createDocument, findByApplicationId };
