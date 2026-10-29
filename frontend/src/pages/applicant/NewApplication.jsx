// src/pages/applicant/NewApplication.jsx
// Multi-step "start a new application" wizard with responsive mobile stepper and theme tokens.

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
  const progressPercent = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="mb-6">
      {/* Mobile view: Compact progress bar and "Step X of Y" */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-semibold text-text-primary mb-1.5">
          <span>Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep]}</span>
          <span className="text-primary-600 dark:text-primary-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-card-subtle overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Desktop view: Step dots and badges */}
      <ol className="hidden sm:flex flex-wrap items-center gap-2 text-xs">
        {STEPS.map((label, index) => {
          const isCurrent = index === currentStep;
          const isDone = index < currentStep;
          return (
            <li key={label} className="flex items-center gap-1.5">
              <span
                className={[
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors',
                  isDone
                    ? 'bg-secondary-600 text-white'
                    : isCurrent
                    ? 'bg-primary-700 text-white ring-2 ring-primary-300 dark:ring-primary-800'
                    : 'bg-card-subtle text-text-muted',
                ].join(' ')}
              >
                {isDone ? '✓' : index + 1}
              </span>
              <span className={isCurrent ? 'font-semibold text-text-primary' : 'text-text-muted'}>
                {label}
              </span>
              {index < STEPS.length - 1 && (
                <span className="text-border-subtle mx-1">›</span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Notice for the Address/Identification steps. */
function NotCollectedNotice({ sectionName }) {
  return (
    <div className="rounded-xl border border-border-theme bg-card-subtle p-4 text-sm text-text-secondary leading-relaxed">
      <strong className="text-text-primary block mb-1">{sectionName}</strong>
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
    <div className="mx-auto max-w-2xl px-2 sm:px-4 py-4 sm:py-8 space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold text-text-primary">New Certificate Application</h1>

      <Card>
        <Stepper currentStep={step} />

        {formError && (
          <div role="alert" className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-600 dark:text-red-400 font-medium">
            {formError}
          </div>
        )}

        {/* Step 0: Personal Information */}
        {step === 0 && (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">This information is retrieved from your verified account.</p>
            <div className="rounded-lg border border-border-theme bg-card-subtle p-3.5 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Full Name</p>
              <p className="text-sm sm:text-base font-medium text-text-primary">{currentUser?.fullName || '—'}</p>
            </div>
          </div>
        )}

        {/* Step 1: Contact Information */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-text-muted">Contact details linked to your account.</p>
            <div className="rounded-lg border border-border-theme bg-card-subtle p-3.5 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Email Address</p>
              <p className="text-sm sm:text-base font-medium text-text-primary">{currentUser?.email || '—'}</p>
            </div>
          </div>
        )}

        {/* Step 2: Address Information */}
        {step === 2 && <NotCollectedNotice sectionName="Address information" />}

        {/* Step 3: Identification Information */}
        {step === 3 && <NotCollectedNotice sectionName="Identification information" />}

        {/* Step 4: Purpose of Certificate */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label htmlFor="purposeOption" className="mb-1.5 block text-sm font-medium text-text-primary">
                Purpose of Certificate <span className="text-red-500 font-bold">*</span>
              </label>
              <select
                id="purposeOption"
                value={purposeOption}
                onChange={(e) => {
                  setPurposeOption(e.target.value);
                  setPurposeError('');
                }}
                className="block w-full min-h-[44px] rounded-lg border border-border-theme bg-surface px-3.5 py-2.5 text-sm sm:text-base text-text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-600"
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
            {!isOtherPurpose && purposeError && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">{purposeError}</p>
            )}
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="rounded-lg border border-border-theme bg-card-subtle p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Full Name</p>
                <p className="text-sm font-medium text-text-primary">{currentUser?.fullName || '—'}</p>
              </div>
              <div className="pt-2 border-t border-border-theme">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Email Address</p>
                <p className="text-sm font-medium text-text-primary">{currentUser?.email || '—'}</p>
              </div>
              <div className="pt-2 border-t border-border-theme">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Purpose of Certificate</p>
                <p className="text-sm font-medium text-text-primary">{finalPurpose}</p>
              </div>
            </div>
            
            <p className="rounded-lg bg-primary-50/50 dark:bg-primary-950/30 p-3 text-xs text-text-muted leading-relaxed">
              After submitting, you will be able to upload supporting documents (such as your National ID and passport photo) on the application details page.
            </p>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="mt-8 pt-4 border-t border-border-theme flex flex-col-reverse sm:flex-row justify-between gap-3">
          <div>
            {step > 0 && (
              <Button variant="outline" onClick={goBack} disabled={isSubmitting} fullWidth className="sm:w-auto">
                Back
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link to="/applicant" className="w-full sm:w-auto">
              <Button variant="outline" disabled={isSubmitting} fullWidth className="sm:w-auto">
                Cancel
              </Button>
            </Link>
            {step < STEPS.length - 1 ? (
              <Button onClick={goNext} fullWidth className="sm:w-auto">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} isLoading={isSubmitting} fullWidth className="sm:w-auto">
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
