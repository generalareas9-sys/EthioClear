// src/pages/applicant/NewApplication.jsx
// Multi-step "start a new application" wizard (frontend Module 3).
//
// IMPORTANT — data model note:
// The backend's `applications` table (see backend schema.sql) stores
// exactly one field beyond identity/status: `purpose`. There is no
// address or identification-document storage anywhere in the schema,
// and the login response only returns { id, fullName, email, role,
// status } for the current user (no phone number or national ID).
//
// To stay honest about what's actually collected and persisted, this
// wizard still walks through the sections suggested for Module 3
// (Personal / Contact / Address / Identification / Purpose) for a
// professional, complete-feeling flow — but the Personal and Contact
// steps are READ-ONLY summaries of the applicant's own account, and
// the Address and Identification steps are explicit "not collected
// in this version" notices rather than inputs that would silently
// discard whatever the applicant typed. Only the Purpose step
// produces data that is actually sent to the backend.
// Supporting documents (national ID scan, photo, etc.) are uploaded
// afterwards, on the application's detail page — that's what the
// backend's document upload endpoint is actually for.

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { createApplication } from '../../services/applicantService.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { CERTIFICATE_PURPOSE_OPTIONS } from '../../utils/constants.js';
import Card from '../../components/common/Card.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';

const STEPS = [
  'Personal Information',
  'Contact Information',
  'Address Information',
  'Identification Information',
  'Purpose of Certificate',
  'Review & Submit',
];

function Stepper({ currentStep }) {
  return (
    <ol className="mb-6 flex flex-wrap gap-x-2 gap-y-2 text-xs">
      {STEPS.map((label, index) => {
        const isCurrent = index === currentStep;
        const isDone = index < currentStep;
        return (
          <li key={label} className="flex items-center gap-1">
            <span
              className={[
                'flex h-5 w-5 items-center justify-center rounded-full font-semibold',
                isDone ? 'bg-secondary-600 text-white' : isCurrent ? 'bg-primary-700 text-white' : 'bg-gray-200 text-gray-500',
              ].join(' ')}
            >
              {isDone ? '✓' : index + 1}
            </span>
            <span className={isCurrent ? 'font-medium text-gray-900' : 'text-gray-500'}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** Reusable "not collected in this prototype" notice for the Address/Identification steps. */
function NotCollectedNotice({ sectionName }) {
  return (
    <div className="rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-600">
      {sectionName} isn't collected in this version of EthioClear — the application record only stores the
      certificate's purpose. If your certificate requires an address or ID number on file, that will be verified
      from the supporting documents you upload after submitting.
    </div>
  );
}

function NewApplication() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [purposeOption, setPurposeOption] = useState(CERTIFICATE_PURPOSE_OPTIONS[0]);
  const [customPurpose, setCustomPurpose] = useState('');
  const [purposeError, setPurposeError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOtherPurpose = purposeOption === 'Other';
  const finalPurpose = (isOtherPurpose ? customPurpose : purposeOption).trim();

  function goNext() {
    if (step === 4) {
      // Leaving the Purpose step — validate before allowing Review.
      if (!finalPurpose) {
        setPurposeError('Please provide a purpose for this certificate.');
        return;
      }
      if (finalPurpose.length > 255) {
        setPurposeError('Purpose must be at most 255 characters.');
        return;
      }
      setPurposeError('');
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    setFormError('');
    setIsSubmitting(true);
    try {
      const application = await createApplication(finalPurpose);
      navigate(`/applicant/applications/${application.id}`, { state: { justCreated: true } });
    } catch (error) {
      setFormError(parseApiError(error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">New Certificate Application</h1>

      <Card>
        <Stepper currentStep={step} />

        {formError && (
          <div role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        )}

        {/* Step 0: Personal Information (read-only, from account) */}
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">This is pulled from your registered account.</p>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Full Name</p>
              <p className="text-sm text-gray-900">{currentUser?.fullName || '—'}</p>
            </div>
          </div>
        )}

        {/* Step 1: Contact Information (read-only, from account) */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">This is pulled from your registered account.</p>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Email Address</p>
              <p className="text-sm text-gray-900">{currentUser?.email || '—'}</p>
            </div>
          </div>
        )}

        {/* Step 2: Address Information (not collected — see file header note) */}
        {step === 2 && <NotCollectedNotice sectionName="Address information" />}

        {/* Step 3: Identification Information (not collected — see file header note) */}
        {step === 3 && <NotCollectedNotice sectionName="Identification information" />}

        {/* Step 4: Purpose of Certificate (the one real, stored field) */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="purposeOption" className="mb-1 block text-sm font-medium text-gray-700">
                Purpose of Certificate <span className="text-red-600">*</span>
              </label>
              <select
                id="purposeOption"
                value={purposeOption}
                onChange={(e) => {
                  setPurposeOption(e.target.value);
                  setPurposeError('');
                }}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                {CERTIFICATE_PURPOSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {isOtherPurpose && (
              <Input
                label="Please specify"
                name="customPurpose"
                value={customPurpose}
                onChange={(e) => {
                  setCustomPurpose(e.target.value);
                  setPurposeError('');
                }}
                placeholder="e.g. Firearm license application"
                error={purposeError}
                required
              />
            )}
            {!isOtherPurpose && purposeError && <p className="text-sm text-red-600">{purposeError}</p>}
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Full Name</p>
              <p className="text-sm text-gray-900">{currentUser?.fullName || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Email Address</p>
              <p className="text-sm text-gray-900">{currentUser?.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">Purpose of Certificate</p>
              <p className="text-sm text-gray-900">{finalPurpose}</p>
            </div>
            <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
              After submitting, you'll be able to upload supporting documents (e.g. National ID, passport photo)
              on the application's details page.
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <div>
            {step > 0 && (
              <Button variant="outline" onClick={goBack} disabled={isSubmitting}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Link to="/applicant">
              <Button variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </Link>
            {step < STEPS.length - 1 ? (
              <Button onClick={goNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isSubmitting}>
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default NewApplication;
