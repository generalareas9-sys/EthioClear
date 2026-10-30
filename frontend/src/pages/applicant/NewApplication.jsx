// src/pages/applicant/NewApplication.jsx
// 3-Step "New Application" Wizard matching Figma design:
// Step 1: Purpose & Application Details (pre-filled editable applicant block, purpose, region, address, notes)
// Step 2: Upload Supporting Documents (4 cards with drag-and-drop, image previews, 5MB validation, file count sync)
// Step 3: Review Your Application (recap with edit jumps, accurate file count & list, honest disclaimer, submit flow)

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { createApplication, uploadDocument } from '../../services/applicantService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { isRequired } from '../../utils/validators.js';

export const APPLICATION_PURPOSE_OPTIONS = [
  'Employment (Local)',
  'Employment (Government)',
  'International Travel / Visa',
  'Higher Education Admission',
  'Immigration / Residency',
  'Adoption Process',
  'Other (specify in notes)',
];

export const ETHIOPIAN_REGIONS = [
  'Addis Ababa',
  'Afar',
  'Amhara',
  'Benishangul-Gumuz',
  'Dire Dawa',
  'Gambela',
  'Harari',
  'Oromia',
  'Sidama',
  'Somali',
  'South Ethiopia',
  'South West Ethiopia',
  'Tigray',
];

const WIZARD_STEPS = [
  { id: 'purpose', number: 1, label: 'Purpose' },
  { id: 'documents', number: 2, label: 'Documents' },
  { id: 'review', number: 3, label: 'Review' },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB (Multer config)
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function UploadIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function DocumentCard({
  id,
  title,
  subtitle,
  required = false,
  file,
  error,
  onFileSelect,
  onFileRemove,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file && file.type && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      onFileSelect(id, droppedFile);
    }
  }

  function handleInputChange(e) {
    const selected = e.target.files?.[0];
    if (selected) {
      onFileSelect(id, selected);
    }
    // reset input so same file can be re-selected if removed
    e.target.value = '';
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        'relative rounded-xl border-2 border-dashed p-4 sm:p-5 transition-all text-center flex flex-col items-center justify-center',
        file
          ? 'border-emerald-400 bg-emerald-50/20'
          : isDragging
          ? 'border-[#0F2A6B] bg-blue-50/50'
          : error
          ? 'border-red-400 bg-red-50/20'
          : 'border-slate-300 hover:border-slate-400 bg-slate-50/40',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        id={id}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        onChange={handleInputChange}
      />

      {file ? (
        /* File selected state */
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3 min-w-0">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-blue-100 text-[#0F2A6B] flex items-center justify-center shrink-0">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {title} {required && <span className="text-red-500">*</span>}
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  <CheckIcon className="h-2.5 w-2.5" /> Ready
                </span>
              </div>
              <p className="text-xs text-slate-600 truncate mt-0.5">
                {file.name} ({formatFileSize(file.size)})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-semibold text-[#0F2A6B] hover:text-[#1E3A8A] px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-100 transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onFileRemove(id)}
              className="text-xs font-semibold text-red-600 hover:text-red-700 px-2.5 py-1.5 rounded hover:bg-red-50 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Empty / drag-and-drop state matching Figma */
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-blue-50 text-[#0F2A6B] flex items-center justify-center mb-2">
            <UploadIcon className="h-5 w-5" />
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-900">
            {title} {required && <span className="text-red-500 font-bold">*</span>}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5 mb-3">
            {subtitle}
          </p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="h-9 px-4 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0F2A6B] text-xs font-bold border border-blue-200 transition-colors focus-visible:outline-[#0F2A6B]"
          >
            Choose File
          </button>
          <span className="text-[10px] text-slate-400 mt-2">or drag & drop file here</span>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}

export default function NewApplication() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0); // 0: Purpose, 1: Documents, 2: Review

  // Step 1 Form Data
  const [formData, setFormData] = useState({
    // Applicant details (pre-filled from account, editable per application)
    applicantName: currentUser?.fullName || '',
    applicantPhone: currentUser?.phoneNumber || '',
    applicantNationalId: currentUser?.nationalIdNumber || '',

    // Application details
    purpose: '',
    region: '',
    address: currentUser?.address || '',
    employerInstitution: '',
    notes: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Step 2 Documents State
  const [documents, setDocuments] = useState({
    nationalIdFront: null,
    nationalIdBack: null,
    passportPhoto: null,
    supportingDoc: null,
  });

  const [documentErrors, setDocumentErrors] = useState({});

  // Step 3 Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  // Handle document file selection with size & type validation
  function handleFileSelect(docKey, file) {
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setDocumentErrors((prev) => ({
        ...prev,
        [docKey]: 'Invalid file type. Only PDF, JPG, and PNG are accepted.',
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setDocumentErrors((prev) => ({
        ...prev,
        [docKey]: `File exceeds maximum allowed size of 5 MB (${formatFileSize(file.size)}).`,
      }));
      return;
    }

    setDocumentErrors((prev) => ({ ...prev, [docKey]: undefined }));
    setDocuments((prev) => ({ ...prev, [docKey]: file }));
  }

  function handleFileRemove(docKey) {
    setDocuments((prev) => ({ ...prev, [docKey]: null }));
    setDocumentErrors((prev) => ({ ...prev, [docKey]: undefined }));
  }

  // Validate Step 1
  function validateStep1() {
    const errors = {};
    if (!isRequired(formData.applicantName)) {
      errors.applicantName = 'Full name is required.';
    }
    if (!isRequired(formData.applicantPhone)) {
      errors.applicantPhone = 'Phone number is required.';
    }
    if (!isRequired(formData.applicantNationalId)) {
      errors.applicantNationalId = 'National ID number is required.';
    }
    if (!formData.purpose) {
      errors.purpose = 'Please select the certificate purpose.';
    }
    if (!formData.region) {
      errors.region = 'Please select the requesting region.';
    }
    if (!isRequired(formData.address)) {
      errors.address = 'Current address is required.';
    }
    if (formData.purpose === 'Other (specify in notes)' && !isRequired(formData.notes)) {
      errors.notes = 'Please specify your purpose in the notes.';
    }

    return errors;
  }

  function handleContinueFromStep1() {
    const errors = validateStep1();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setCurrentStep(1);
  }

  // Validate Step 2: Ensure 3 required documents are present
  function validateStep2() {
    const errors = {};
    if (!documents.nationalIdFront) {
      errors.nationalIdFront = 'National ID (Front) is required.';
    }
    if (!documents.nationalIdBack) {
      errors.nationalIdBack = 'National ID (Back) is required.';
    }
    if (!documents.passportPhoto) {
      errors.passportPhoto = 'Passport-size Photo is required.';
    }
    return errors;
  }

  function handleContinueFromStep2() {
    const errors = validateStep2();
    if (Object.keys(errors).length > 0) {
      setDocumentErrors(errors);
      return;
    }
    setDocumentErrors({});
    setCurrentStep(2);
  }

  function handleBack() {
    setFieldErrors({});
    setSubmitError('');
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  // Total uploaded files count and list for Step 3 Review
  const selectedDocEntries = Object.entries(documents).filter(([_, f]) => f !== null);
  const uploadedCount = selectedDocEntries.length;

  const docTypeLabels = {
    nationalIdFront: 'National ID (Front)',
    nationalIdBack: 'National ID (Back)',
    passportPhoto: 'Passport-size Photo',
    supportingDoc: 'Supporting Document',
  };

  // Submit complete application with documents
  async function handleFinalSubmit() {
    setSubmitError('');
    setIsSubmitting(true);

    try {
      // 1. Create the application record
      const app = await createApplication(formData.purpose);

      // 2. Upload each selected document sequentially to the application
      const uploadQueue = [
        { file: documents.nationalIdFront, type: 'National ID (Front)' },
        { file: documents.nationalIdBack, type: 'National ID (Back)' },
        { file: documents.passportPhoto, type: 'Passport Photo' },
        ...(documents.supportingDoc ? [{ file: documents.supportingDoc, type: 'Supporting Document' }] : []),
      ];

      for (const item of uploadQueue) {
        if (item.file) {
          await uploadDocument(app.id, item.file, item.type);
        }
      }

      setSubmittedApplication(app);
    } catch (err) {
      setSubmitError(parseApiError(err).message || 'Failed to submit application. Please check your documents and try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-6">
      
      {/* Page Header: Title in Serif Navy, Subtitle in Muted Slate */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F2A6B] tracking-tight">
          New Application
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
          Complete all steps to submit your criminal record certificate request.
        </p>
      </div>

      {/* 3-Step Horizontal Stepper matching Figma */}
      <div className="mb-8 max-w-2xl mx-auto">
        {/* Mobile View: Step Badge and Progress */}
        <div className="sm:hidden mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
            <span>
              Step {currentStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep].label}
            </span>
            <span className="text-[#0F2A6B] font-extrabold">
              {Math.round(((currentStep + 1) / WIZARD_STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-[#0F2A6B] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop View: Stepper with connecting lines */}
        <ol className="hidden sm:flex items-center justify-between w-full" aria-label="Application wizard steps">
          {WIZARD_STEPS.map((step, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <li
                key={step.id}
                aria-current={isCurrent ? 'step' : undefined}
                className="flex-1 flex items-center last:flex-none"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={[
                      'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-200',
                      isCompleted
                        ? 'bg-[#0E8A3E] text-white'
                        : isCurrent
                        ? 'bg-[#0F2A6B] text-white ring-4 ring-[#0F2A6B]/20 shadow-xs'
                        : 'bg-slate-200 text-slate-600',
                    ].join(' ')}
                  >
                    {isCompleted ? <CheckIcon className="h-3.5 w-3.5" /> : step.number}
                  </div>
                  <span
                    className={[
                      'text-xs sm:text-sm font-semibold transition-colors',
                      isCurrent
                        ? 'text-[#0F2A6B] font-bold'
                        : isCompleted
                        ? 'text-slate-800 font-semibold'
                        : 'text-slate-600 font-medium',
                    ].join(' ')}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < WIZARD_STEPS.length - 1 && (
                  <div
                    className={[
                      'flex-1 h-0.5 mx-4 transition-colors duration-300',
                      isCompleted ? 'bg-[#0E8A3E]' : 'bg-slate-200',
                    ].join(' ')}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Main Centered Card Container (Max-width ~680px) */}
      <div className="max-w-[680px] mx-auto bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        
        {/* ========================================================================= */}
        {/* STEP 1: Purpose / Application Details */}
        {/* ========================================================================= */}
        {currentStep === 0 && (
          <div>
            {/* Pre-filled editable applicant information block */}
            <div className="mb-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F2A6B]">
                  Applicant Information
                </h3>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Account Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Pre-filled from your account. You can correct them for this application.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="applicantName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Full Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="applicantName"
                    name="applicantName"
                    type="text"
                    required
                    value={formData.applicantName}
                    onChange={handleChange}
                    className={[
                      'w-full h-11 px-3 rounded-lg text-xs sm:text-sm font-medium text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.applicantName ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  {fieldErrors.applicantName && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.applicantName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="applicantPhone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="applicantPhone"
                    name="applicantPhone"
                    type="tel"
                    required
                    value={formData.applicantPhone}
                    onChange={handleChange}
                    className={[
                      'w-full h-11 px-3 rounded-lg text-xs sm:text-sm font-medium text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.applicantPhone ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  {fieldErrors.applicantPhone && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.applicantPhone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="applicantNationalId" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    National ID <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="applicantNationalId"
                    name="applicantNationalId"
                    type="text"
                    required
                    value={formData.applicantNationalId}
                    onChange={handleChange}
                    className={[
                      'w-full h-11 px-3 rounded-lg text-xs sm:text-sm font-mono text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.applicantNationalId ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  {fieldErrors.applicantNationalId && (
                    <p className="mt-1 text-[11px] text-red-600 font-medium">{fieldErrors.applicantNationalId}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Application Details Section Header */}
            <div className="mb-5 pb-2 border-b border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-[#0F2A6B]">
                Application Details
              </h2>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="purpose" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Certificate Purpose <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="purpose"
                    name="purpose"
                    required
                    value={formData.purpose}
                    onChange={handleChange}
                    className={[
                      'w-full h-12 px-3.5 pr-10 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border appearance-none transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.purpose ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  >
                    <option value="">Select purpose...</option>
                    {APPLICATION_PURPOSE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.purpose && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.purpose}</p>
                )}
              </div>

              <div>
                <label htmlFor="region" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Requesting Region <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <select
                    id="region"
                    name="region"
                    required
                    value={formData.region}
                    onChange={handleChange}
                    className={[
                      'w-full h-12 px-3.5 pr-10 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border appearance-none transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.region ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  >
                    <option value="">Select region...</option>
                    {ETHIOPIAN_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.region && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.region}</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Address <span className="text-red-500 font-bold">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  required
                  placeholder="Kebele, Woreda, Sub-city, City..."
                  value={formData.address}
                  onChange={handleChange}
                  className={[
                    'w-full p-3 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                    'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                    fieldErrors.address ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                  ].join(' ')}
                />
                {fieldErrors.address && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.address}</p>
                )}
              </div>

              <div>
                <label htmlFor="employerInstitution" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Employer / Institution (If applicable)
                </label>
                <input
                  id="employerInstitution"
                  name="employerInstitution"
                  type="text"
                  placeholder="Name of employer or institution requesting the certificate"
                  value={formData.employerInstitution}
                  onChange={handleChange}
                  className="w-full h-12 px-3.5 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border border-slate-300/80 hover:border-slate-400 focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20 transition-colors shadow-xs"
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Additional Notes {formData.purpose === 'Other (specify in notes)' && <span className="text-red-500 font-bold">*</span>}
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  required={formData.purpose === 'Other (specify in notes)'}
                  placeholder="Any additional information relevant to your application..."
                  value={formData.notes}
                  onChange={handleChange}
                  className={[
                    'w-full p-3 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                    'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                    fieldErrors.notes ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                  ].join(' ')}
                />
                {fieldErrors.notes && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.notes}</p>
                )}
              </div>
            </div>

            {/* Step 1 Actions */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
              <Link
                to="/applicant/applications"
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg focus-visible:outline-[#0F2A6B]"
              >
                Cancel
              </Link>
              <button
                type="button"
                onClick={handleContinueFromStep1}
                className="h-12 px-8 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all focus-visible:outline-[#0F2A6B]"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Upload Supporting Documents (Matching Figma layout) */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-[#0F2A6B]">
                Upload Supporting Documents
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                All documents must be clear, legible scans. Accepted formats: PDF, JPG, PNG. Max 5 MB each.
              </p>
            </div>

            <div className="space-y-4">
              {/* National ID (Front) * */}
              <DocumentCard
                id="nationalIdFront"
                title="National ID (Front)"
                subtitle="Front side of your Ethiopian National ID"
                required={true}
                file={documents.nationalIdFront}
                error={documentErrors.nationalIdFront}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              {/* National ID (Back) * */}
              <DocumentCard
                id="nationalIdBack"
                title="National ID (Back)"
                subtitle="Back side of your Ethiopian National ID"
                required={true}
                file={documents.nationalIdBack}
                error={documentErrors.nationalIdBack}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              {/* Passport-size Photo * */}
              <DocumentCard
                id="passportPhoto"
                title="Passport-size Photo"
                subtitle="Recent photo, white background, no glasses"
                required={true}
                file={documents.passportPhoto}
                error={documentErrors.passportPhoto}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />

              {/* Supporting Document (Optional) */}
              <DocumentCard
                id="supportingDoc"
                title="Supporting Document (Optional)"
                subtitle="Employment letter, university admission, etc."
                required={false}
                file={documents.supportingDoc}
                error={documentErrors.supportingDoc}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
              />
            </div>

            {/* Step 2 Actions */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0F2A6B] px-3 py-2 rounded-lg focus-visible:outline-[#0F2A6B]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleContinueFromStep2}
                disabled={!documents.nationalIdFront || !documents.nationalIdBack || !documents.passportPhoto}
                className="h-12 px-8 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-[#0F2A6B]"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Review Your Application (Matching Figma layout + Bug fix) */}
        {/* ========================================================================= */}
        {currentStep === 2 && !submittedApplication && (
          <div>
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-[#0F2A6B]">
                Review Your Application
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                Verify all application details and uploaded documents before submission.
              </p>
            </div>

            {submitError && (
              <div
                role="alert"
                className="mb-5 rounded-lg bg-red-50 border border-red-200 p-4 text-xs sm:text-sm font-medium text-red-700 flex items-start gap-2.5"
              >
                <svg className="h-5 w-5 shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="flex-1 leading-snug">{submitError}</div>
              </div>
            )}

            {/* Summary Table */}
            <div className="rounded-xl border border-slate-200/90 bg-slate-50/60 divide-y divide-slate-200/80 text-xs sm:text-sm overflow-hidden mb-6">
              
              {/* Applicant Name */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                <span className="text-slate-500 font-medium">Applicant Name</span>
                <div className="flex items-center gap-3 mt-1 sm:mt-0">
                  <span className="font-bold text-slate-900 uppercase">{formData.applicantName}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="text-xs text-[#0F2A6B] hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* National ID */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                <span className="text-slate-500 font-medium">National ID</span>
                <span className="font-mono font-bold text-slate-900 mt-1 sm:mt-0">{formData.applicantNationalId}</span>
              </div>

              {/* Phone */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                <span className="text-slate-500 font-medium">Phone Number</span>
                <span className="font-medium text-slate-900 mt-1 sm:mt-0">{formData.applicantPhone}</span>
              </div>

              {/* Purpose */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                <span className="text-slate-500 font-medium">Purpose</span>
                <div className="flex items-center gap-3 mt-1 sm:mt-0">
                  <span className="font-bold text-slate-900">{formData.purpose}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(0)}
                    className="text-xs text-[#0F2A6B] hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {/* Region */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                <span className="text-slate-500 font-medium">Region</span>
                <span className="font-medium text-slate-900 mt-1 sm:mt-0">{formData.region}</span>
              </div>

              {/* Address */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                <span className="text-slate-500 font-medium">Address</span>
                <span className="font-medium text-slate-900 mt-1 sm:mt-0 text-right max-w-xs">{formData.address}</span>
              </div>

              {/* Employer / Institution */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                <span className="text-slate-500 font-medium">Employer/Institution</span>
                <span className="font-medium text-slate-900 mt-1 sm:mt-0">{formData.employerInstitution || '—'}</span>
              </div>

              {/* Notes (if any) */}
              {formData.notes && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5">
                  <span className="text-slate-500 font-medium">Notes</span>
                  <span className="font-medium text-slate-900 mt-1 sm:mt-0 text-right max-w-xs">{formData.notes}</span>
                </div>
              )}

              {/* Documents Uploaded (Fixed Figma bug: Real count & filenames) */}
              <div className="p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 font-medium">Documents Uploaded</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-xs">
                      {uploadedCount} file(s) attached
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#0F2A6B] hover:underline font-semibold"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <ul className="space-y-1.5 mt-2">
                  {selectedDocEntries.map(([key, file]) => (
                    <li key={key} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold text-slate-800">{docTypeLabels[key]}:</span>
                        <span className="text-slate-600 truncate">{file.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 shrink-0 ml-2">{formatFileSize(file.size)}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Honest Warning Notice matching requirements */}
            <div className="mb-6 rounded-xl bg-amber-50/80 border border-amber-200/90 p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
              <svg className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <div className="leading-relaxed">
                By submitting, you confirm that all information is accurate. Providing false information may lead to rejection of your application.
              </div>
            </div>

            {/* Step 3 Actions */}
            <div className="pt-5 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#0F2A6B] px-3 py-2 rounded-lg"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="h-12 px-8 rounded-lg bg-[#0E8A3E] hover:bg-[#0B7333] text-white font-bold text-sm sm:text-base shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-[#0E8A3E] flex items-center gap-2"
              >
                {isSubmitting && (
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                    role="status"
                    aria-label="Loading"
                  />
                )}
                <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUCCESS CONFIRMATION SCREEN */}
        {/* ========================================================================= */}
        {submittedApplication && (
          <div className="text-center py-6 sm:py-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-[#0E8A3E] mb-4 ring-8 ring-emerald-50">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F2A6B] tracking-tight">
              Application Submitted!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
              Your criminal record certificate application has been submitted and queued for officer verification.
            </p>

            {/* Reference Box */}
            <div className="mt-6 max-w-md mx-auto rounded-xl bg-slate-50 border border-slate-200/90 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Application Reference</span>
                <span className="font-mono font-bold text-slate-900">{submittedApplication.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Purpose</span>
                <span className="font-bold text-slate-900">{formData.purpose}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Region</span>
                <span className="font-bold text-slate-900">{formData.region}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Status</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 capitalize">
                  {submittedApplication.status || 'submitted'}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to={`/applicant/applications/${submittedApplication.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-sm transition-all"
              >
                View Application
              </Link>
              <Link
                to="/applicant/applications"
                className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
