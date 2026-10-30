// src/pages/auth/Register.jsx
// Redesigned 4-Step Registration Wizard for EthioClear matching Figma specifications:
// - Hosted inside AuthLayout (two-column split screen on desktop, clean light on mobile)
// - Polished horizontal stepper with navy active state, green completed state, connecting lines, and mobile badge
// - Form fields styled with #EAF0FB fill, 48px height, uppercase slate labels, red asterisks, and clear focus rings
// - Multi-step validation preserving the existing registration payload and error handling
// - Step 4 confirmation screen with reference recap and direct link to Login

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { parseApiError } from '../../utils/parseApiError.js';
import {
  isRequired,
  isValidEmail,
  isValidNationalId,
  isValidEthiopianPhone,
  isAtLeast18,
  getPasswordRequirementErrors,
  getPasswordStrength,
} from '../../utils/validators.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';

const ETHIOPIAN_REGIONS = [
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

const STEPS = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'contact', title: 'Contact Details' },
  { id: 'account', title: 'Account Setup' },
  { id: 'confirmation', title: 'Confirmation' },
];

const INITIAL_FORM = {
  firstName: '',
  middleName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  region: '',
  nationalIdNumber: '',
  email: '',
  phoneDigits: '',
  address: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
};

function EyeIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M2.5 12S5.5 6 12 6s9.5 6 9.5 6-3 6-9.5 6S2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M17.94 17.94A10.97 10.97 0 0 1 12 19c-6.5 0-9.5-6-9.5-6a18.24 18.24 0 0 1 4.24-4.89" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

function CheckIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={className} aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Register() {
  const { register } = useAuth();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(0); // 0 to 3
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isConflict, setIsConflict] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formError) {
      setFormError('');
      setIsConflict(false);
    }
  }

  // Format National ID input into EID-000-000-000 pattern
  function handleNationalIdChange(event) {
    let raw = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.startsWith('EID')) {
      raw = raw.slice(3);
    }
    const digits = raw.replace(/\D/g, '').slice(0, 9);
    let formatted = 'EID';
    if (digits.length > 0) formatted += `-${digits.slice(0, 3)}`;
    if (digits.length > 3) formatted += `-${digits.slice(3, 6)}`;
    if (digits.length > 6) formatted += `-${digits.slice(6, 9)}`;

    setFormData((prev) => ({ ...prev, nationalIdNumber: digits.length === 0 ? '' : formatted }));
    if (fieldErrors.nationalIdNumber) {
      setFieldErrors((prev) => ({ ...prev, nationalIdNumber: undefined }));
    }
    if (formError) {
      setFormError('');
      setIsConflict(false);
    }
  }

  // Format phone digits input
  function handlePhoneChange(event) {
    const digits = event.target.value.replace(/\D/g, '').slice(0, 9);
    setFormData((prev) => ({ ...prev, phoneDigits: digits }));
    if (fieldErrors.phoneNumber) {
      setFieldErrors((prev) => ({ ...prev, phoneNumber: undefined }));
    }
    if (formError) {
      setFormError('');
      setIsConflict(false);
    }
  }

  // Validate Step 1: Personal Info
  function validateStep1() {
    const errors = {};
    if (!isRequired(formData.firstName)) {
      errors.firstName = 'First name is required.';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters.';
    }

    if (!isRequired(formData.lastName)) {
      errors.lastName = 'Last name is required.';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters.';
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required.';
    } else if (!isAtLeast18(formData.dateOfBirth)) {
      errors.dateOfBirth = 'You must be at least 18 years old to register.';
    }

    if (!formData.gender) {
      errors.gender = 'Please select your gender.';
    }

    if (!formData.region) {
      errors.region = 'Please select your region.';
    }

    if (!isRequired(formData.nationalIdNumber)) {
      errors.nationalIdNumber = 'National ID number is required.';
    } else if (!isValidNationalId(formData.nationalIdNumber)) {
      errors.nationalIdNumber = 'National ID must match format EID-000-000-000.';
    }

    return errors;
  }

  // Validate Step 2: Contact Details
  function validateStep2() {
    const errors = {};
    if (!isRequired(formData.email)) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.phoneDigits) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!isValidEthiopianPhone(`+251${formData.phoneDigits}`)) {
      errors.phoneNumber = 'Enter a valid 9-digit mobile number (e.g. 912345678).';
    }

    return errors;
  }

  // Validate Step 3: Account Setup
  function validateStep3() {
    const errors = {};
    const passReqs = getPasswordRequirementErrors(formData.password);
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (passReqs.length > 0) {
      errors.password = passReqs[0];
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms of Service to continue.';
    }

    return errors;
  }

  function handleNextStep() {
    let errors = {};
    if (currentStep === 0) errors = validateStep1();
    if (currentStep === 1) errors = validateStep2();

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }

  function handlePrevStep() {
    setFieldErrors({});
    setFormError('');
    setIsConflict(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }

  async function handleFinalSubmit(event) {
    if (event) event.preventDefault();
    setFormError('');
    setIsConflict(false);

    const step1Errors = validateStep1();
    if (Object.keys(step1Errors).length > 0) {
      setFieldErrors(step1Errors);
      setCurrentStep(0);
      return;
    }

    const step2Errors = validateStep2();
    if (Object.keys(step2Errors).length > 0) {
      setFieldErrors(step2Errors);
      setCurrentStep(1);
      return;
    }

    const step3Errors = validateStep3();
    if (Object.keys(step3Errors).length > 0) {
      setFieldErrors(step3Errors);
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const fullPhone = `+251${formData.phoneDigits}`;
      const payload = {
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim() || undefined,
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        region: formData.region,
        nationalIdNumber: formData.nationalIdNumber.trim(),
        email: formData.email.trim(),
        phoneNumber: fullPhone,
        address: formData.address.trim(),
        password: formData.password,
      };

      await register(payload);
      // Advance to confirmation step on success
      setCurrentStep(3);
    } catch (error) {
      const { message, fieldErrors: apiFieldErrors } = parseApiError(error);
      const is409 = error?.response?.status === 409;
      setIsConflict(is409);
      setFormError(message);
      setFieldErrors(apiFieldErrors || {});

      const step1Fields = ['firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender', 'region', 'nationalIdNumber'];
      const step2Fields = ['email', 'phoneNumber', 'address'];

      const hasStep1Error = Object.keys(apiFieldErrors || {}).some((f) => step1Fields.includes(f));
      const hasStep2Error = Object.keys(apiFieldErrors || {}).some((f) => step2Fields.includes(f));

      if (hasStep1Error) {
        setCurrentStep(0);
      } else if (hasStep2Error || is409) {
        setCurrentStep(1);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const passwordStrength = getPasswordStrength(formData.password);

  // Top header action for AuthLayout
  const topAction = (
    <div className="flex items-center gap-2">
      <span className="text-xs sm:text-sm text-slate-600 font-normal">
        {t('auth.alreadyHaveAccount')}
      </span>
      <Link
        to="/login"
        className="text-xs sm:text-sm font-bold text-[#0F2A6B] hover:text-[#1E3A8A] hover:underline focus-visible:outline-[#0F2A6B] rounded px-1.5 py-0.5"
      >
        {t('nav.login')}
      </Link>
    </div>
  );

  return (
    <AuthLayout topAction={topAction} cardMaxWidth="max-w-[560px]">
      
      {/* Horizontal Wizard Stepper Header */}
      <div className="mb-6 w-full">
        {/* Mobile View: Compact progress bar and Step X of 4 */}
        <div className="sm:hidden mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
            <span>
              Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
            </span>
            <span className="text-[#0F2A6B] font-extrabold">
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-[#0F2A6B] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Desktop View: Polished Circles with connecting lines */}
        <ol className="hidden sm:flex items-center justify-between w-full" aria-label="Registration steps">
          {STEPS.map((stepItem, idx) => {
            const isCompleted = currentStep > idx;
            const isCurrent = currentStep === idx;
            return (
              <li
                key={stepItem.id}
                aria-current={isCurrent ? 'step' : undefined}
                className="flex-1 flex items-center last:flex-none"
              >
                <div className="flex flex-col items-center group">
                  <div
                    className={[
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-200',
                      isCompleted
                        ? 'bg-[#0E8A3E] text-white'
                        : isCurrent
                        ? 'bg-[#0F2A6B] text-white ring-4 ring-[#0F2A6B]/20 shadow-xs'
                        : 'bg-slate-200 text-slate-600',
                    ].join(' ')}
                  >
                    {isCompleted ? <CheckIcon className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={[
                      'mt-1.5 text-[11px] font-semibold tracking-tight transition-colors whitespace-nowrap',
                      isCurrent
                        ? 'text-[#0F2A6B] font-bold'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-600',
                    ].join(' ')}
                  >
                    {stepItem.title}
                  </span>
                </div>

                {idx < STEPS.length - 1 && (
                  <div
                    className={[
                      'flex-1 h-0.5 mx-2 -mt-5 transition-colors duration-300',
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

      {/* Main Registration Card */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        
        {/* Error notification banner */}
        {formError && (
          <div
            role="alert"
            className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-xs sm:text-sm font-medium text-red-700 flex items-start gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 shrink-0 text-red-500 mt-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="font-semibold">{formError}</p>
              {isConflict && (
                <div className="mt-2 text-xs">
                  Already registered?{' '}
                  <Link to="/login" className="font-bold underline text-red-800 hover:text-red-900">
                    Sign in to your account
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: Personal Information */}
        {currentStep === 0 && (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-normal text-[#0F2A6B] tracking-tight">
                Personal Information
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                Enter your details exactly as they appear on your official national ID.
              </p>
            </div>

            <div className="space-y-4">
              {/* Names row: First, Middle, Last */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    First Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="Abebe"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={[
                      'w-full h-12 px-3.5 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.firstName ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  {fieldErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="middleName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Middle Name
                  </label>
                  <input
                    id="middleName"
                    name="middleName"
                    type="text"
                    placeholder="Tadesse"
                    value={formData.middleName}
                    onChange={handleChange}
                    className="w-full h-12 px-3.5 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border border-slate-300/80 hover:border-slate-400 focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20 transition-colors shadow-xs"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Last Name <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Bekele"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={[
                      'w-full h-12 px-3.5 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.lastName ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  {fieldErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* DOB & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Date of Birth <span className="text-red-500 font-bold">*</span>
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={[
                      'w-full h-12 px-3.5 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.dateOfBirth ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  {fieldErrors.dateOfBirth && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.dateOfBirth}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Gender <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="gender"
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className={[
                        'w-full h-12 px-3.5 pr-10 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border appearance-none transition-colors shadow-xs',
                        'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                        fieldErrors.gender ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                      ].join(' ')}
                    >
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {fieldErrors.gender && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.gender}</p>
                  )}
                </div>
              </div>

              {/* Region */}
              <div>
                <label htmlFor="region" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Region <span className="text-red-500 font-bold">*</span>
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
                    <option value="">Select region</option>
                    {ETHIOPIAN_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.region && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.region}</p>
                )}
              </div>

              {/* National ID Number */}
              <div>
                <label htmlFor="nationalIdNumber" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  National ID No. <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="nationalIdNumber"
                  name="nationalIdNumber"
                  type="text"
                  required
                  placeholder="EID-000-000-000"
                  value={formData.nationalIdNumber}
                  onChange={handleNationalIdChange}
                  className={[
                    'w-full h-12 px-3.5 rounded-lg text-sm font-mono text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                    'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                    fieldErrors.nationalIdNumber ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                  ].join(' ')}
                />
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  Format: EID-000-000-000 (9 digits). Numeric keypad auto-formats.
                </p>
                {fieldErrors.nationalIdNumber && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.nationalIdNumber}</p>
                )}
              </div>
            </div>

            {/* Stepper Action Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="h-12 px-8 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all focus-visible:outline-[#0F2A6B]"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Contact Details */}
        {currentStep === 1 && (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-normal text-[#0F2A6B] tracking-tight">
                Contact Details
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                We use this email and phone number to send your status updates and verification codes.
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="abebe.bekele@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={[
                    'w-full h-12 px-3.5 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                    'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                    fieldErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                  ].join(' ')}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.email}</p>
                )}
              </div>

              {/* Phone Number (+251 prefix) */}
              <div>
                <label htmlFor="phoneDigits" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="flex rounded-lg shadow-xs overflow-hidden border border-slate-300/80 focus-within:border-[#0F2A6B] focus-within:ring-2 focus-within:ring-[#0F2A6B]/20">
                  <span className="inline-flex items-center px-3.5 bg-slate-100 text-slate-700 text-sm font-semibold border-r border-slate-300 select-none">
                    +251
                  </span>
                  <input
                    id="phoneDigits"
                    name="phoneDigits"
                    type="tel"
                    required
                    placeholder="912345678"
                    value={formData.phoneDigits}
                    onChange={handlePhoneChange}
                    className="w-full h-12 px-3.5 text-sm font-normal text-slate-900 bg-[#EAF0FB] focus:bg-white focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-slate-600 font-medium">
                  Enter 9 digits without the leading 0 (e.g. 912345678).
                </p>
                {fieldErrors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.phoneNumber}</p>
                )}
              </div>

              {/* Residential Address */}
              <div>
                <label htmlFor="address" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Current Residential Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  placeholder="Sub-city, Woreda, House No..."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3.5 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border border-slate-300/80 hover:border-slate-400 focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20 transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-sm font-semibold text-slate-600 hover:text-[#0F2A6B] py-2 px-3 rounded-lg focus-visible:outline-[#0F2A6B]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="h-12 px-8 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all focus-visible:outline-[#0F2A6B]"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Account Setup */}
        {currentStep === 2 && (
          <div>
            <div className="mb-6">
              <h2 className="font-serif text-2xl font-normal text-[#0F2A6B] tracking-tight">
                Account Setup
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                Create a secure password to protect your certificate applications.
              </p>
            </div>

            <div className="space-y-4">
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={[
                      'w-full h-12 pl-3.5 pr-11 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.password ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-md focus-visible:outline-[#0F2A6B]"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.password}</p>
                )}

                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={[
                          'h-full transition-all duration-300',
                          passwordStrength.level === 'weak' && 'w-1/3 bg-red-500',
                          passwordStrength.level === 'medium' && 'w-2/3 bg-yellow-500',
                          passwordStrength.level === 'strong' && 'w-full bg-emerald-600',
                        ].filter(Boolean).join(' ')}
                      />
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Strength: <span className="font-bold capitalize">{passwordStrength.level}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirm Password <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={[
                      'w-full h-12 pl-3.5 pr-11 rounded-lg text-sm font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                      'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                      fieldErrors.confirmPassword ? 'border-red-400 bg-red-50/30' : 'border-slate-300/80 hover:border-slate-400',
                    ].join(' ')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-md focus-visible:outline-[#0F2A6B]"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              {/* Password checklist */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200 text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Password requirements:</p>
                <ul className="list-disc pl-4 space-y-0.5">
                  <li>At least 8 characters in length</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one lowercase letter (a-z)</li>
                  <li>At least one numeric digit (0-9)</li>
                </ul>
              </div>

              {/* Agree Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0F2A6B] focus:ring-[#0F2A6B]"
                  />
                  <span className="text-xs text-slate-700 leading-normal">
                    I agree to the{' '}
                    <Link to="/terms" className="font-bold text-[#0F2A6B] hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="font-bold text-[#0F2A6B] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {fieldErrors.agreeTerms && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{fieldErrors.agreeTerms}</p>
                )}
              </div>
            </div>

            {/* Stepper Buttons */}
            <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevStep}
                className="text-sm font-semibold text-slate-600 hover:text-[#0F2A6B] py-2 px-3 rounded-lg focus-visible:outline-[#0F2A6B]"
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleFinalSubmit}
                className="h-12 px-8 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-[#0F2A6B] flex items-center gap-2"
              >
                {isSubmitting && (
                  <span
                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                    role="status"
                    aria-label="Loading"
                  />
                )}
                <span>{isSubmitting ? 'Creating account...' : 'Create Account'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Confirmation Screen */}
        {currentStep === 3 && (
          <div className="text-center py-4 sm:py-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 ring-8 ring-emerald-50">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F2A6B] tracking-tight">
              Registration Successful!
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#475569] max-w-md mx-auto leading-relaxed">
              Your applicant account has been created. You can now sign in to start your criminal record certificate application.
            </p>

            {/* Recap Box */}
            <div className="mt-6 max-w-sm mx-auto rounded-xl bg-slate-50 border border-slate-200/90 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Applicant Name</span>
                <span className="font-bold text-slate-900">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Email</span>
                <span className="font-bold text-slate-900">{formData.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">National ID</span>
                <span className="font-mono font-bold text-slate-900">{formData.nationalIdNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Region</span>
                <span className="font-bold text-slate-900">{formData.region}</span>
              </div>
            </div>

            {/* Direct Login CTA */}
            <div className="mt-8">
              <Link
                to="/login"
                state={{ registered: true }}
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all focus-visible:outline-[#0F2A6B]"
              >
                Sign In to EthioClear →
              </Link>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
}
