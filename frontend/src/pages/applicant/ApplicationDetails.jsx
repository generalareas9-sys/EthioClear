// src/pages/applicant/ApplicationDetails.jsx
// Full detail view for a single application (Module 3 + Module 7 Feature 5).
//
// Certificate download (Feature 5):
// The backend's GET /api/applicant/applications/:id response does not
// include a certificate id or download URL. The download endpoint is
// GET /api/certificates/:certificateId/download and requires the
// certificate's own UUID — which is not returned to applicants by
// any current backend route. The download button therefore shows a
// clear "contact admin" message rather than a broken button.
// If a future backend update returns { certificate: { id } } in the
// application response, replace the notice block below with a real
// download call using api.get(`/certificates/${certificate.id}/download`, {responseType:'blob'}).

import { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getApplication, uploadDocument } from '../../services/applicantService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, formatDateTime, getReferenceNumber, formatFileSize } from '../../utils/format.js';
import {
  APPLICATION_STATUS_META,
  DOCUMENT_STATUS_META,
  DOCUMENT_TYPE_OPTIONS,
  ALLOWED_DOCUMENT_MIME_TYPES,
  MAX_UPLOAD_SIZE_MB,
} from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';
import ProgressBar from '../../components/ui/ProgressBar.jsx';

const UPLOADABLE_STATUSES = ['submitted', 'rejected'];

function DocumentUploadForm({ applicationId, onUploaded }) {
  const [documentTypeOption, setDocumentTypeOption] = useState(DOCUMENT_TYPE_OPTIONS[0]);
  const [customType, setCustomType] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [formError, setFormError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const isOtherType = documentTypeOption === 'Other';
  const finalDocumentType = (isOtherType ? customType : documentTypeOption).trim();

  function handleFileChange(event) {
    const selected = event.target.files?.[0] || null;
    setFileError('');

    if (selected) {
      if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(selected.type)) {
        setFileError('Only PDF, JPEG, and PNG files are allowed.');
        setFile(null);
        return;
      }
      if (selected.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
        setFileError(`File is too large (${formatFileSize(selected.size)}). Maximum size is ${MAX_UPLOAD_SIZE_MB}MB.`);
        setFile(null);
        return;
      }
    }
    setFile(selected);
  }

  async function handleUpload(event) {
    event.preventDefault();
    setFormError('');

    if (!file) {
      setFileError('Please choose a file to upload.');
      return;
    }
    if (!finalDocumentType) {
      setFormError('Please specify a document type.');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    try {
      await uploadDocument(applicationId, file, finalDocumentType, (progressEvent) => {
        if (progressEvent.total) {
          setProgress(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }
      });
      setFile(null);
      setCustomType('');
      setDocumentTypeOption(DOCUMENT_TYPE_OPTIONS[0]);
      onUploaded();
    } catch (error) {
      const { message, fieldErrors } = parseApiError(error);
      setFormError(fieldErrors.documentType || message);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3 rounded-md border border-dashed border-gray-300 p-4">
      {formError && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </div>
      )}

      <div>
        <label htmlFor="documentTypeOption" className="mb-1 block text-sm font-medium text-gray-700">
          Document Type <span className="text-red-600">*</span>
        </label>
        <select
          id="documentTypeOption"
          value={documentTypeOption}
          onChange={(e) => setDocumentTypeOption(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
        >
          {DOCUMENT_TYPE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {isOtherType && (
        <input
          type="text"
          value={customType}
          onChange={(e) => setCustomType(e.target.value)}
          placeholder="Specify document type"
          className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm"
        />
      )}

      <div>
        <label htmlFor="documentFile" className="mb-1 block text-sm font-medium text-gray-700">
          File <span className="text-red-600">*</span>
        </label>
        <input
          id="documentFile"
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
        />
        {file && !fileError && (
          <p className="mt-1 text-xs text-gray-500">
            Selected: {file.name} ({formatFileSize(file.size)})
          </p>
        )}
        {fileError && <p className="mt-1 text-sm text-red-600">{fileError}</p>}
        <p className="mt-1 text-xs text-gray-400">PDF, JPEG, or PNG. Max {MAX_UPLOAD_SIZE_MB}MB.</p>
      </div>

      {isUploading && <ProgressBar percent={progress} />}

      <Button type="submit" isLoading={isUploading}>
        Upload Document
      </Button>
    </form>
  );
}

function ApplicationDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState('');

  const justCreated = Boolean(location.state?.justCreated);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setNotFound(false);
    try {
      const data = await getApplication(id);
      setApplication(data.application);
      setDocuments(data.documents);
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotFound(true);
      } else {
        setError(parseApiError(err).message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUploaded() {
    const wasRejected = application?.status === 'rejected';
    await load();
    setUploadSuccessMessage(
      wasRejected ? 'Document uploaded and your application was resubmitted for review.' : 'Document uploaded successfully.'
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" label="Loading application…" />
      </div>
    );
  }

  if (notFound) {
    return (
      <Card>
        <p className="text-sm text-gray-600">This application could not be found, or doesn't belong to your account.</p>
        <Link to="/applicant/applications" className="mt-3 inline-block text-sm font-medium text-primary-700 hover:underline">
          ← Back to My Applications
        </Link>
      </Card>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}{' '}
        <button type="button" onClick={load} className="font-medium underline">
          Retry
        </button>
      </div>
    );
  }

  const statusMeta = APPLICATION_STATUS_META[application.status];
  const canUploadDocuments = UPLOADABLE_STATUSES.includes(application.status);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/applicant/applications" className="text-sm font-medium text-primary-700 hover:underline">
        ← Back to My Applications
      </Link>

      {justCreated && (
        <div className="rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">
          Application submitted successfully. Upload your supporting documents below to move it forward.
        </div>
      )}
      {uploadSuccessMessage && (
        <div className="rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">{uploadSuccessMessage}</div>
      )}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{getReferenceNumber(application.id)}</h1>
            <p className="text-sm text-gray-600">{application.purpose}</p>
          </div>
          <StatusBadge label={statusMeta?.label || application.status} badgeClass={statusMeta?.badgeClass} />
        </div>

        <dl className="mt-4 grid grid-cols-1 gap-3 border-t border-gray-100 pt-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Submitted</dt>
            <dd className="text-gray-900">{formatDateTime(application.submitted_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Last Updated</dt>
            <dd className="text-gray-900">{formatDateTime(application.updated_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-500">Reviewed</dt>
            <dd className="text-gray-900">{application.reviewed_at ? formatDateTime(application.reviewed_at) : 'Not yet reviewed'}</dd>
          </div>
        </dl>

        {application.status === 'rejected' && application.rejection_reason && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            <p className="font-medium">Rejection reason / officer remarks</p>
            <p className="mt-1">{application.rejection_reason}</p>
            <p className="mt-2 text-xs text-red-600">
              You can upload a corrected document below — this will automatically resubmit your application.
            </p>
          </div>
        )}

        {application.status === 'certificate_issued' && (
          <div className="mt-4 rounded-md bg-primary-50 px-4 py-3 text-sm text-primary-800">
            <p className="font-semibold">🎉 Certificate Issued</p>
            <p className="mt-1">
              Your certificate has been generated. Your verification officer or administrator
              can download it from the officer dashboard and provide it to you.
            </p>
            <p className="mt-2 text-xs text-primary-600">
              To check the authenticity of a certificate you've received, use the verification
              link below — you'll need the certificate ID or the QR code from the PDF.
            </p>
            <Link
              to="/verify"
              className="mt-2 inline-block rounded-md bg-primary-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-800"
            >
              Verify a Certificate →
            </Link>
          </div>
        )}
      </Card>

      <Card title="Uploaded Documents">
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500">No documents uploaded yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {documents.map((doc) => {
              const docMeta = DOCUMENT_STATUS_META[doc.status];
              return (
                <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{doc.document_type}</p>
                    <p className="text-xs text-gray-500">
                      {doc.original_file_name} · {formatDate(doc.uploaded_at)}
                    </p>
                  </div>
                  <StatusBadge label={docMeta?.label || doc.status} badgeClass={docMeta?.badgeClass} />
                </li>
              );
            })}
          </ul>
        )}

        {canUploadDocuments ? (
          <div className="mt-4">
            <DocumentUploadForm applicationId={application.id} onUploaded={handleUploaded} />
          </div>
        ) : (
          <p className="mt-4 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
            Documents are locked while the application is in '{statusMeta?.label || application.status}' status.
          </p>
        )}
      </Card>
    </div>
  );
}

export default ApplicationDetails;
