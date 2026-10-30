// src/pages/public/CertificateVerification.jsx
// Public certificate verification page (Module 6) matching Figma style with academic transparency.
// Accessible at /verify (search form) and /verify/:id (auto-verify via QR code).
// Requires NO login — this is a fully public route inside PublicLayout.

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { extractCertificateId, verifyCertificate } from '../../services/verificationService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { formatDate } from '../../utils/format.js';
import Card from '../../components/common/Card.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

// ------------------------------------------------------------------
// Result status badge
// ------------------------------------------------------------------
const RESULT_META = {
  valid:     { label: 'VALID CERTIFICATE', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  revoked:   { label: 'REVOKED RECORD',    className: 'bg-rose-100 text-rose-800 border-rose-300' },
  not_found: { label: 'RECORD NOT FOUND',  className: 'bg-amber-100 text-amber-800 border-amber-300' },
  invalid:   { label: 'INVALID SIGNATURE', className: 'bg-rose-100 text-rose-800 border-rose-300' },
};

function deriveResultKey(data) {
  if (!data) return null;
  if (data.notSearchable) return 'not_found';
  if (!data.certificateId && !data.certificateNumber) return 'not_found';
  if (!data.isValid) {
    return data.status === 'revoked' ? 'revoked' : 'not_found';
  }
  return 'valid';
}

function ResultBadge({ resultKey }) {
  const meta = RESULT_META[resultKey] || RESULT_META.invalid;
  return (
    <span className={`inline-flex items-center rounded-xl px-5 py-2 text-base sm:text-lg font-bold tracking-wider border shadow-sm ${meta.className}`}>
      {meta.label}
    </span>
  );
}

// ------------------------------------------------------------------
// Displays the verification result
// ------------------------------------------------------------------
function VerificationResult({ data }) {
  const resultKey = deriveResultKey(data);

  // "Not searchable" case — cert number entered, no UUID available
  if (data?.notSearchable) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-center space-y-4">
        <ResultBadge resultKey="not_found" />
        <p className="text-sm text-slate-600 max-w-md mx-auto">{data.message}</p>
        {data.certificateNumber && (
          <p className="text-xs font-mono text-slate-400">Entered: {data.certificateNumber}</p>
        )}
      </div>
    );
  }

  // Certificate not found
  if (!data?.certificateId && !data?.certificateNumber) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md text-center space-y-4">
        <ResultBadge resultKey="not_found" />
        <p className="text-sm text-slate-600">
          No active certificate was found for the provided identifier. Please confirm the UUID or scan the certificate QR code directly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-lg relative overflow-hidden space-y-6">
      
      {/* National Ribbon Stripe across top */}
      <div className="flex h-1.5 w-full rounded-full overflow-hidden absolute top-0 left-0 right-0">
        <div className="w-1/3 bg-[#0E8A3E]"></div>
        <div className="w-1/3 bg-[#FCCB0B]"></div>
        <div className="w-1/3 bg-[#E11D1D]"></div>
      </div>

      {/* Status header */}
      <div className="flex flex-col items-center gap-3 border-b border-slate-100 pb-5 text-center pt-2">
        <ResultBadge resultKey={resultKey} />
        {data.notice && (
          <p className="max-w-md text-xs text-slate-500">{data.notice}</p>
        )}
      </div>

      {/* Certificate fields grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {[
          ['Certificate Number', data.certificateNumber],
          ['Status',             data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : '—'],
          ['Applicant Name',     data.applicantName],
          ['Purpose',            data.purpose],
          ['Issue Date',         data.issuedAt ? formatDate(data.issuedAt) : '—'],
          ['Certificate ID',     data.certificateId],
        ].map(([label, value]) =>
          value ? (
            <div key={label} className="p-3 rounded-lg bg-[#F4F6FB] border border-slate-100">
              <dt className="text-xs font-mono uppercase tracking-wider text-slate-400">{label}</dt>
              <dd className="mt-1 font-semibold text-slate-900 break-all">{value}</dd>
            </div>
          ) : null
        )}
      </dl>

      {/* QR verification URL */}
      {data.qrCodeValue && (
        <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="font-mono uppercase text-[10px] block text-slate-400 mb-1">Authenticated QR URL</span>
          <p className="font-mono break-all text-blue-600">{data.qrCodeValue}</p>
        </div>
      )}

      {/* Prototype seal statement */}
      <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/50 text-center text-xs text-blue-900">
        Demo Record • Verified by EthioClear Academic Prototype (Haramaya University)
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// Main page component
// ------------------------------------------------------------------
function CertificateVerification() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inputValue, setInputValue]   = useState('');
  const [inputError, setInputError]   = useState('');
  const [result, setResult]           = useState(null);
  const [isLoading, setIsLoading]     = useState(false);
  const [serverError, setServerError] = useState('');

  const runVerification = useCallback(async (raw) => {
    setServerError('');
    setResult(null);
    setIsLoading(true);
    try {
      const certId = extractCertificateId(raw);
      if (certId) {
        const data = await verifyCertificate(certId);
        setResult(data);
      } else {
        setResult({
          isValid: false,
          notSearchable: true,
          certificateNumber: raw.trim(),
          message:
            'Certificate number lookup is not directly supported by this prototype. ' +
            'Please enter the full certificate UUID or scan the QR code to verify.',
        });
      }
    } catch (err) {
      setServerError(parseApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    const certId = extractCertificateId(trimmed);
    if (certId && certId !== id) {
      navigate(`/verify/${certId}`, { replace: false });
      return;
    }
    runVerification(trimmed);
  }

  return (
    <div className="bg-[#F4F6FB] min-h-screen text-slate-800 transition-colors">
      
      {/* 1. HERO BANNER */}
      <section className="bg-gradient-to-r from-[#0F2A6B] to-[#1E3A8A] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-blue-900/50">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="w-12 h-1 bg-[#D4A53A] mx-auto rounded-full"></div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
            Certificate Verification
          </h1>
          <p className="max-w-xl mx-auto text-blue-100 text-sm sm:text-base leading-relaxed">
            Verify the authenticity of an EthioClear criminal record clearance certificate by entering its certificate UUID or scanning its QR code.
          </p>
        </div>
      </section>

      {/* 2. VERIFIER FORM & RESULTS */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-8">
        
        {/* Academic prototype disclaimer */}
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-800 flex items-start gap-3">
          <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">!</span>
          <p>
            <strong>Academic Demonstration:</strong> Certificates verified on this platform are prototype test records generated for Haramaya University graduation research, not legal government documents.
          </p>
        </div>

        {/* Verification input card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Certificate ID or Verification URL"
              name="certificateInput"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setInputError(''); }}
              placeholder="Paste certificate UUID (e.g. d0000000-0000-4000-8000-000000000001) or /verify/... URL"
              error={inputError}
            />
            <p className="text-xs text-slate-500">
              Tip: Scanning the QR code on a clearance certificate will open this verifier automatically with the authentic record.
            </p>
            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading} 
              className="bg-[#0F2A6B] hover:bg-[#1e3a8a] text-white font-semibold py-3"
            >
              Verify Certificate
            </Button>
          </form>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-8 flex justify-center">
            <LoadingSpinner size="lg" label="Querying verification database…" />
          </div>
        )}

        {/* Server Error Alert */}
        {serverError && !isLoading && (
          <div role="alert" className="rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
            {serverError}
          </div>
        )}

        {/* Result view */}
        {result && !isLoading && (
          <div>
            <VerificationResult data={result} />
          </div>
        )}

      </section>

    </div>
  );
}

export default CertificateVerification;