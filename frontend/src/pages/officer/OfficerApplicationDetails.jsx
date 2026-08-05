// src/pages/officer/OfficerApplicationDetails.jsx
// Full application detail view for officers (frontend Module 4).
// Displays complete applicant information, application data, documents
// with in-page preview support (PDF, JPEG, PNG), submission history,
// current status, and Approve / Reject action dialogs.
//
// Document preview note: the backend serves uploaded files as static
// assets from storage/uploads/ — however, it does NOT expose a
// public static file endpoint in any of the backend modules built so
// far (Modules 3–8 only expose JSON API routes). The document rows
// therefore show all metadata available from the API (type, name,
// size, status, uploaded date). A preview modal is included that
// constructs a URL pointing at the backend's likely static-serve path
// (/uploads/<filename>) for when that route is added; until then,
// clicking Preview shows a friendly "not yet available" message rather
// than a broken image.

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplication, approveApplication, rejectApplication } from '../../services/officerService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate, formatDateTime, getReferenceNumber } from '../../utils/format.js';
import { APPLICATION_STATUS_META, DOCUMENT_STATUS_META } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import StatusBadge from '../../components/ui/StatusBadge.jsx';

const REVIEWABLE_STATUSES = ['submitted', 'under_review'];

// ------------------------------------------------------------------
// Document preview modal
// ------------------------------------------------------------------
function DocumentPreviewModal({ doc, onClose }) {
  // Backend doesn't yet expose a static-file serve route, so we
  // construct the likely URL for when it does. If the fetch fails
  // the <img>/<iframe> falls back to its error display.
  const previewUrl = doc
    ? `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}/uploads/${doc.file_name}`
    : null;

  const isImage = doc && ['image/jpeg', 'image/png'].includes(doc.mime_type);
  const isPdf   = doc && doc.mime_type === 'application/pdf';

  return (
    <Modal isOpen={Boolean(doc)} onClose={onClose} title={doc?.document_type || 'Document Preview'}>
      {doc && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">{doc.original_file_name}</p>
          {isImage && (
            <img
              src={previewUrl}
              alt={doc.document_type}
              className="max-h-80 w-full rounded object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          {isPdf && (
            <iframe
              src={previewUrl}
              title={doc.document_type}
              className="h-80 w-full rounded border"
            />
          )}
          <p className="text-xs text-gray-400">
            If the preview doesn't load, the backend static-file route may not yet be enabled.
          </p>
        </div>
      )}
    </Modal>
  );
}

// ------------------------------------------------------------------
// Reject dialog
// ------------------------------------------------------------------
function RejectDialog({ isOpen, onClose, onConfirm, isSubmitting }) {
  const [reason, setReason] = useState('');
  const [error, setError]   = useState('');

  function handleConfirm() {
    if (!reason.trim()) {
      setError('Rejection reason is required.');
      return;
    }
    if (reason.trim().length > 1000) {
      setError('Rejection reason must be at most 1000 characters.');
      return;
    }
    setError('');
    onConfirm(reason.trim());
  }

  // Reset form whenever dialog opens.
  useEffect(() => {
    if (isOpen) { setReason(''); setError(''); }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reject Application"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm} isLoading={isSubmitting}>Confirm Rejection</Button>
        </>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Provide a clear reason explaining why this application is being rejected. The applicant will see this
          message and can re-upload corrected documents.
        </p>
        <div>
          <label htmlFor="rejectReason" className="mb-1 block text-sm font-medium text-gray-700">
            Rejection Reason <span className="text-red-600">*</span>
          </label>
          <textarea
            id="rejectReason"
            rows={4}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(''); }}
            placeholder="e.g. Uploaded ID photo is illegible — please resubmit a clearer scan."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </Modal>
  );
}

// ------------------------------------------------------------------
// Approve confirmation dialog
// ------------------------------------------------------------------
function ApproveDialog({ isOpen, onClose, onConfirm, isSubmitting }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Approve Application"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button variant="secondary" onClick={onConfirm} isLoading={isSubmitting}>Confirm Approval</Button>
        </>
      }
    >
      <p className="text-sm text-gray-600">
        Are you sure you want to approve this application? The applicant's status will be updated immediately and
        a certificate can then be generated.
      </p>
    </Modal>
  );
}

// ------------------------------------------------------------------
// Main page
// ------------------------------------------------------------------
function OfficerApplicationDetails() {
  const { id } = useParams();

  const [application, setApplication]         = useState(null);
  const [documents, setDocuments]             = useState([]);
  const [isLoading, setIsLoading]             = useState(true);
  const [error, setError]                     = useState('');
  const [notFound, setNotFound]               = useState(false);

  const [actionError, setActionError]         = useState('');
  const [successMessage, setSuccessMessage]   = useState('');
  const [isActioning, setIsActioning]         = useState(false);

  const [showApproveDialog, setShowApproveDialog]   = useState(false);
  const [showRejectDialog, setShowRejectDialog]     = useState(false);
  const [previewDoc, setPreviewDoc]                 = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError('');
    setNotFound(false);
    try {
      const data = await getApplication(id);
      setApplication(data.application);
      setDocuments(data.documents);
    } catch (err) {
      if (err?.response?.status === 404) setNotFound(true);
      else setError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  async function handleApprove() {
    setIsActioning(true);
    setActionError('');
    try {
      const updated = await approveApplication(id);
      setApplication(updated);
      setSuccessMessage('Application approved successfully.');
      setShowApproveDialog(false);
    } catch (err) {
      setActionError(parseApiError(err).message);
      setShowApproveDialog(false);
    } finally {
      setIsActioning(false);
    }
  }

  async function handleReject(reason) {
    setIsActioning(true);
    setActionError('');
    try {
      const updated = await rejectApplication(id, reason);
      setApplication(updated);
      setSuccessMessage('Application rejected. The applicant has been notified.');
      setShowRejectDialog(false);
    } catch (err) {
      setActionError(parseApiError(err).message);
      setShowRejectDialog(false);
    } finally {
      setIsActioning(false);
    }
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
        <p className="text-sm text-gray-600">Application not found.</p>
        <Link to="/officer/queue" className="mt-3 inline-block text-sm font-medium text-primary-700 hover:underline">
          ← Back to Queue
        </Link>
      </Card>
    );
  }

  if (error) {
    return (
      <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
        {error}{' '}
        <button type="button" onClick={load} className="font-medium underline">Retry</button>
      </div>
    );
  }

  const statusMeta   = APPLICATION_STATUS_META[application.status];
  const canReview    = REVIEWABLE_STATUSES.includes(application.status);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/officer/queue" className="text-sm font-medium text-primary-700 hover:underline">
        ← Back to Queue
      </Link>

      {actionError && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{actionError}</div>
      )}
      {successMessage && (
        <div className="rounded-md bg-secondary-50 px-3 py-2 text-sm text-secondary-800">{successMessage}</div>
      )}

      {/* Application header */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{getReferenceNumber(application.id)}</h1>
            <p className="text-sm text-gray-600">{application.purpose}</p>
          </div>
          <StatusBadge label={statusMeta?.label || application.status} badgeClass={statusMeta?.badgeClass} />
        </div>

        {/* Applicant info */}
        <h2 className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Applicant Information</h2>
        <dl className="mt-2 grid grid-cols-1 gap-3 border-t border-gray-100 pt-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Name</dt>
            <dd className="text-gray-900">{application.applicant_name}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Email</dt>
            <dd className="text-gray-900">{application.applicant_email}</dd>
          </div>
        </dl>

        {/* Application info */}
        <h2 className="mt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Application Information</h2>
        <dl className="mt-2 grid grid-cols-1 gap-3 border-t border-gray-100 pt-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Submitted</dt>
            <dd className="text-gray-900">{formatDateTime(application.submitted_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Last Updated</dt>
            <dd className="text-gray-900">{formatDateTime(application.updated_at)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-gray-400">Reviewed At</dt>
            <dd className="text-gray-900">{application.reviewed_at ? formatDateTime(application.reviewed_at) : '—'}</dd>
          </div>
        </dl>

        {application.rejection_reason && (
          <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            <p className="font-medium">Previous Rejection Reason / Officer Remarks</p>
            <p className="mt-1">{application.rejection_reason}</p>
          </div>
        )}

        {/* Action buttons */}
        {canReview && (
          <div className="mt-5 flex gap-3 border-t border-gray-100 pt-4">
            <Button
              variant="secondary"
              onClick={() => { setActionError(''); setSuccessMessage(''); setShowApproveDialog(true); }}
              disabled={isActioning}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              onClick={() => { setActionError(''); setSuccessMessage(''); setShowRejectDialog(true); }}
              disabled={isActioning}
            >
              Reject
            </Button>
          </div>
        )}
      </Card>

      {/* Documents */}
      <Card title="Uploaded Documents">
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500">No documents have been uploaded for this application.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {documents.map((doc) => {
              const docMeta = DOCUMENT_STATUS_META[doc.status];
              return (
                <li key={doc.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{doc.document_type}</p>
                    <p className="text-xs text-gray-500">
                      {doc.original_file_name} · {formatDate(doc.uploaded_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge label={docMeta?.label || doc.status} badgeClass={docMeta?.badgeClass} />
                    <button
                      type="button"
                      onClick={() => setPreviewDoc(doc)}
                      className="text-xs font-medium text-primary-700 hover:underline"
                    >
                      Preview
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {/* Dialogs */}
      <ApproveDialog
        isOpen={showApproveDialog}
        onClose={() => setShowApproveDialog(false)}
        onConfirm={handleApprove}
        isSubmitting={isActioning}
      />
      <RejectDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={handleReject}
        isSubmitting={isActioning}
      />
      <DocumentPreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  );
}

export default OfficerApplicationDetails;
