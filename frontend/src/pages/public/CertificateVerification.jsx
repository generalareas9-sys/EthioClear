// src/pages/public/CertificateVerification.jsx
// Public certificate verification page (frontend Module 6).
// Accessible at /verify (search form) and /verify/:id (auto-verify).
// Requires NO login — this is a fully public route inside PublicLayout.
//
// Accepts:
//   • A certificate UUID  (e.g. d0000000-0000-4000-8000-000000000001)
//   • A full QR verification URL (e.g. http://…/verify/<uuid>)
//   • A certificate number for UX clarity; surfaces a friendly
//     "can't look up by number" message since the backend has no
//     search-by-number endpoint.
//
// When the route includes :id (/verify/:id), the page auto-runs
// the verification on mount without requiring a form submission —
// this is the URL embedded in the QR code on every certificate PDF.

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { extractCertificateId, verifyCertificate } from '../../services/verificationService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate } from '../../utils/format.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

// ------------------------------------------------------------------
// Result status badge — larger than the usual StatusBadge pill since
// this is the primary output of the verification page.
// ------------------------------------------------------------------
const RESULT_META = {
  valid:     { label: 'VALID',     className: 'bg-secondary-100 text-secondary-800 border border-secondary-300' },
  revoked:   { label: 'REVOKED',   className: 'bg-red-100     text-red-800     border border-red-300'          },
  not_found: { label: 'NOT FOUND', className: 'bg-gray-100    text-gray-700    border border-gray-300'         },
  invalid:   { label: 'INVALID',   className: 'bg-red-100     text-red-800     border border-red-300'          },
};

function deriveResultKey(data) {
  if (!data) return null;
  if (data.notSearchable) return 'not_found';
  if (!data.certificateId && !data.certificateNumber) return 'not_found';
  if (!data.isValid) {
    // Backend returns status:'revoked' when revoked
    return data.status === 'revoked' ? 'revoked' : 'not_found';
  }
  return 'valid';
}

function ResultBadge({ resultKey }) {
  const meta = RESULT_META[resultKey] || RESULT_META.invalid;
  return (
    <span className={`inline-flex items-center rounded-lg px-4 py-1.5 text-lg font-bold tracking-wide ${meta.className}`}>
      {meta.label}
    </span>
  );
}

// ------------------------------------------------------------------
// Displays the verification result — fields from the backend's
// toPublicVerificationView() shape.
// ------------------------------------------------------------------
function VerificationResult({ data }) {
  const resultKey = deriveResultKey(data);

  // "Not searchable" case — cert number entered, no UUID available.
  if (data?.notSearchable) {
    return (
      <Card>
        <div className="space-y-3 text-center">
          <ResultBadge resultKey="not_found" />
          <p className="text-sm text-gray-600">{data.message}</p>
          {data.certificateNumber && (
            <p className="text-xs text-gray-400">Entered: {data.certificateNumber}</p>
          )}
        </div>
      </Card>
    );
  }

  // Certificate not found (200 with isValid:false and no cert data).
  if (!data?.certificateId && !data?.certificateNumber) {
    return (
      <Card>
        <div className="space-y-3 text-center">
          <ResultBadge resultKey="not_found" />
          <p className="text-sm text-gray-600">No certificate was found for the provided identifier.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Status header */}
      <div className="flex flex-col items-center gap-2 border-b border-gray-100 pb-4 text-center">
        <ResultBadge resultKey={resultKey} />
        {data.notice && <p className="max-w-md text-xs text-gray-400">{data.notice}</p>}
      </div>

      {/* Certificate fields */}
      <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        {[
          ['Certificate Number', data.certificateNumber],
          ['Status',             data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : '—'],
          ['Applicant Name',     data.applicantName],
          ['Purpose',            data.purpose],
          ['Issue Date',         data.issuedAt ? formatDate(data.issuedAt) : '—'],
          ['Certificate ID',     data.certificateId],
        ].map(([label, value]) =>
          value ? (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</dt>
              <dd className="mt-0.5 break-all text-gray-900">{value}</dd>
            </div>
          ) : null
        )}
      </dl>

      {/* QR value — shown if returned by the backend */}
      {data.qrCodeValue && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Verification URL</p>
          <p className="break-all text-xs text-gray-600">{data.qrCodeValue}</p>
        </div>
      )}
    </Card>
  );
}

// ------------------------------------------------------------------
// Main page component
// ------------------------------------------------------------------
function CertificateVerification() {
  const { id } = useParams();          // present on /verify/:id
  const navigate = useNavigate();

  const [inputValue, setInputValue]   = useState('');
  const [inputError, setInputError]   = useState('');
  const [result, setResult]           = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [serverError, setServerError] = useState('');

  // Core verification logic, shared by form submit and auto-verify.
  const runVerification = useCallback(async (raw) => {
    setServerError('');
    setResult(null);
    setIsLoading(true);
    try {
      // The service handles UUID extraction, full URL parsing, and
      // the cert-number "not searchable" case (see verificationService.js).
      const certId = extractCertificateId(raw);
      if (certId) {
        const data = await verifyCertificate(certId);
        setResult(data);
      } else {
        // Input is neither a UUID nor a URL containing one — treat
        // as a certificate number with a clear explanation.
        setResult({
          isValid: false,
          notSearchable: true,
          certificateNumber: raw.trim(),
          message:
            'Certificate number lookup is not yet supported by this system. ' +
            'Please scan the QR code on your certificate or paste the full verification URL.',
        });
      }
    } catch (err) {
      setServerError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-verify when a :id is present in the URL (QR scan flow).
  useEffect(() => {
    if (id) {
      setInputValue(id);
      runVerification(id);
    }
  }, [id, runVerification]);

  function handleSubmit(e) {
    e.preventDefault();
    setInputError('');
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setInputError('Please enter a certificate ID or verification URL.');
      return;
    }
    // Update the URL so the result is shareable/bookmarkable.
    const certId = extractCertificateId(trimmed);
    if (certId && certId !== id) {
      navigate(`/verify/${certId}`, { replace: false });
      // The useEffect above will fire and call runVerification.
      return;
    }
    // Non-UUID input — run inline (no URL change needed).
    runVerification(trimmed);
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Certificate Verification</h1>
        <p className="mt-2 text-sm text-gray-600">
          Verify the authenticity of an EthioClear certificate by entering its ID or scanning its QR code.
        </p>
        <div className="mx-auto mt-2 max-w-md rounded-md bg-yellow-50 px-3 py-1.5 text-xs text-yellow-700">
          Academic prototype — certificates verified here are demonstration records, not legal documents.
        </div>
      </div>

      {/* Search form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Certificate ID or Verification URL"
            name="certificateInput"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
            placeholder="Paste certificate UUID or full /verify/… URL"
            error={inputError}
          />
          <p className="text-xs text-gray-400">
            Tip: scan the QR code on the certificate with your phone camera — it will open this page automatically.
          </p>
          <Button type="submit" fullWidth isLoading={isLoading}>
            Verify Certificate
          </Button>
        </form>
      </Card>

      {/* Loading */}
      {isLoading && (
        <div className="mt-6 flex justify-center">
          <LoadingSpinner size="lg" label="Verifying certificate…" />
        </div>
      )}

      {/* Server error */}
      {serverError && !isLoading && (
        <div role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* Verification result */}
      {result && !isLoading && (
        <div className="mt-6">
          <VerificationResult data={result} />
        </div>
      )}
    </div>
  );
}

export default CertificateVerification;
