// src/pages/auth/Register.jsx
// 4-Step Registration Wizard for EthioClear applicants matching Figma design:
// Step 1: Personal Information
// Step 2: Contact Details
// Step 3: Account Setup
// Step 4: Confirmation

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
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

function Logo({ size = 34 }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo.svg" alt="EthioClear" className="h-8 w-auto object-contain" />
    </div>
  );
}

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

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

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
    // only keep digits after EID
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

  // Validate Step 1
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

  // Validate Step 2
  function validateStep2() {
    const errors = {};
    if (!isRequired(formData.email)) {
      errors.email = 'Email address is required.';
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.phoneDigits) {
      errors.phoneNumber = 'Phone number is required.';
    } else if (!isValidEthiopianPhone(formData.phoneDigits)) {
      errors.phoneNumber = 'Enter a valid 9-digit Ethiopian number starting with 9 or 7.';
    }

    if (!isRequired(formData.address)) {
      errors.address = 'Current residential address is required.';
    } else if (formData.address.trim().length < 3) {
      errors.address = 'Please provide a more descriptive address (Kebele, Woreda, City...).';
    }

    return errors;
  }

  // Validate Step 3
  function validateStep3() {
    const errors = {};
    const unmet = getPasswordRequirementErrors(formData.password);
    if (!isRequired(formData.password)) {
      errors.password = 'Password is required.';
    } else if (unmet.length > 0) {
      errors.password = `Password must include ${unmet.join(', ')}.`;
    }

    if (!isRequired(formData.confirmPassword)) {
      errors.confirmPassword = 'Please repeat your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      errors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy to continue.';
    }

    return errors;
  }

  function handleContinue() {
    setFormError('');
    setIsConflict(false);

    if (currentStep === 0) {
      const errors = validateStep1();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setCurrentStep(1);
    } else if (currentStep === 1) {
      const errors = validateStep2();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      setFieldErrors({});
      setCurrentStep(2);
    }
  }

  function handleBack() {
    setFormError('');
    setIsConflict(false);
    setFieldErrors({});
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  async function handleSubmit(event) {
    if (event) event.preventDefault();
    setFormError('');
    setIsConflict(false);

    // Final checks for all steps
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
      setFieldErrors(apiFieldErrors);

      // On server validation errors, automatically jump back to the step containing the field
      const step1Fields = ['firstName', 'middleName', 'lastName', 'dateOfBirth', 'gender', 'region', 'nationalIdNumber'];
      const step2Fields = ['email', 'phoneNumber', 'address'];

      const hasStep1Error = Object.keys(apiFieldErrors).some((f) => step1Fields.includes(f));
      const hasStep2Error = Object.keys(apiFieldErrors).some((f) => step2Fields.includes(f));

      if (hasStep1Error) {
        setCurrentStep(0);
      } else if (hasStep2Error || is409) {
        // If it's email duplicate conflict or step 2 field error, navigate to step 2
        setCurrentStep(1);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword.length > 0 && formData.password === formData.confirmPassword;
  const isStep3Valid =
    formData.password.length >= 8 &&
    getPasswordRequirementErrors(formData.password).length === 0 &&
    formData.password === formData.confirmPassword &&
    formData.agreeTerms;

  return (
    <div className="min-h-screen flex flex-col bg-app text-text-primary font-sans transition-colors duration-150">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 bg-header border-b border-border-theme">
        <Link to="/" className="focus:outline-none focus:ring-2 focus:ring-primary-600 rounded-lg p-1">
          <Logo size={32} />
        </Link>
        <p className="text-xs sm:text-sm text-text-muted">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 sm:py-12">
        <div className="w-full max-w-[575px]">
          {/* 4-Step Stepper */}
          <nav aria-label="Registration Progress" className="mb-8">
            <ol className="flex items-center justify-center gap-0">
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <li key={step.id} className="flex items-center" aria-current={isCurrent ? 'step' : undefined}>
                    <div className="flex flex-col items-center">
                      <div
                        className={[
                          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm',
                          isCompleted
                            ? 'bg-[#16a34a] text-white'
                            : isCurrent
                            ? 'bg-[#0f2d6b] text-white ring-4 ring-blue-100 dark:ring-blue-900/40'
                            : 'bg-[#e8edf5] dark:bg-slate-800 text-[#94a3b8] dark:text-slate-500',
                        ].join(' ')}
                      >
                        {isCompleted ? (
                          <svg
                            width="14"
                            height="14"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={[
                          'text-[10px] sm:text-xs mt-1.5 font-medium hidden sm:block',
                          isCurrent
                            ? 'text-[#0f2d6b] dark:text-blue-300 font-bold'
                            : isCompleted
                            ? 'text-slate-700 dark:text-slate-300'
                            : 'text-[#94a3b8] dark:text-slate-500',
                        ].join(' ')}
                      >
                        {step.title}
                      </span>
                    </div>

                    {index < STEPS.length - 1 && (
                      <div
                        className={[
                          'w-10 sm:w-16 h-0.5 mx-1.5 mb-0 sm:mb-4 transition-colors',
                          index < currentStep ? 'bg-[#16a34a]' : 'bg-[#e8edf5] dark:bg-slate-700',
                        ].join(' ')}
                        aria-hidden="true"
                      />
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Wizard Card */}
          <div className="bg-card text-text-primary rounded-2xl border border-border-theme shadow-lg p-5 sm:p-8">
            {/* General / Conflict Alert Box */}
            {formError && (
              <div
                role="alert"
                className="mb-6 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 p-4 text-sm text-red-700 dark:text-red-300"
              >
                {isConflict ? (
                  <span>
                    We couldn&#39;t complete registration with these details. If you already registered, you can{' '}
                    <Link to="/login" className="font-semibold underline hover:text-red-900 dark:hover:text-red-100">
                      log in
                    </Link>{' '}
                    or{' '}
                    <Link to="/forgot-password" className="font-semibold underline hover:text-red-900 dark:hover:text-red-100">
                      reset your password
                    </Link>
                    .
                  </span>
                ) : (
                  formError
                )}
              </div>
            )}

            {/* STEP 1: Personal Information */}
            {currentStep === 0 && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0f2d6b] dark:text-blue-200 mb-1">
                  Personal Information
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Enter your details exactly as they appear on your national ID.
                </p>

                <div className="space-y-4">
                  {/* Name Fields: 3 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Abebe"
                        aria-invalid={Boolean(fieldErrors.firstName)}
                        aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                        className={[
                          'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                          fieldErrors.firstName ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                        ].join(' ')}
                      />
                      {fieldErrors.firstName && (
                        <p id="firstName-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="middleName" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Middle Name
                      </label>
                      <input
                        id="middleName"
                        name="middleName"
                        type="text"
                        value={formData.middleName}
                        onChange={handleChange}
                        placeholder="Tadesse"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Bekele"
                        aria-invalid={Boolean(fieldErrors.lastName)}
                        aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                        className={[
                          'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                          fieldErrors.lastName ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                        ].join(' ')}
                      />
                      {fieldErrors.lastName && (
                        <p id="lastName-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DOB and Gender: 2 columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="dateOfBirth" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.dateOfBirth)}
                        aria-describedby={fieldErrors.dateOfBirth ? 'dateOfBirth-error' : undefined}
                        className={[
                          'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                          fieldErrors.dateOfBirth ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                        ].join(' ')}
                      />
                      {fieldErrors.dateOfBirth && (
                        <p id="dateOfBirth-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                          {fieldErrors.dateOfBirth}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        aria-invalid={Boolean(fieldErrors.gender)}
                        aria-describedby={fieldErrors.gender ? 'gender-error' : undefined}
                        className={[
                          'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                          fieldErrors.gender ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                        ].join(' ')}
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      {fieldErrors.gender && (
                        <p id="gender-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                          {fieldErrors.gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Region */}
                  <div>
                    <label htmlFor="region" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Region <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      aria-invalid={Boolean(fieldErrors.region)}
                      aria-describedby={fieldErrors.region ? 'region-error' : undefined}
                      className={[
                        'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                        fieldErrors.region ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                      ].join(' ')}
                    >
                      <option value="">Select region</option>
                      {ETHIOPIAN_REGIONS.map((reg) => (
                        <option key={reg} value={reg}>
                          {reg}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.region && (
                      <p id="region-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.region}
                      </p>
                    )}
                  </div>

                  {/* National ID No. */}
                  <div>
                    <label htmlFor="nationalIdNumber" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      National ID No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="nationalIdNumber"
                      name="nationalIdNumber"
                      type="text"
                      value={formData.nationalIdNumber}
                      onChange={handleNationalIdChange}
                      placeholder="EID-000-000-000"
                      maxLength={15}
                      aria-invalid={Boolean(fieldErrors.nationalIdNumber)}
                      aria-describedby={fieldErrors.nationalIdNumber ? 'nationalIdNumber-error' : 'nationalIdNumber-hint'}
                      className={[
                        'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 tracking-wider font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                        fieldErrors.nationalIdNumber ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                      ].join(' ')}
                    />
                    {fieldErrors.nationalIdNumber ? (
                      <p id="nationalIdNumber-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.nationalIdNumber}
                      </p>
                    ) : (
                      <p id="nationalIdNumber-hint" className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                        Prototype format: EID-000-000-000 (3 blocks of 3 digits). Never checked against a real registry.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Contact Details */}
            {currentStep === 1 && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0f2d6b] dark:text-blue-200 mb-1">
                  Contact Details
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  We&#39;ll use these to send you application updates and your certificate.
                </p>

                <div className="space-y-4">
                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(fieldErrors.email)}
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      className={[
                        'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                        fieldErrors.email ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                      ].join(' ')}
                    />
                    {fieldErrors.email && (
                      <p id="email-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone Number: Fixed +251 prefix inside same field row */}
                  <div>
                    <label htmlFor="phoneDigits" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div
                      className={[
                        'flex items-center rounded-lg border bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-[#0f2d6b] dark:focus-within:ring-blue-500',
                        fieldErrors.phoneNumber ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                      ].join(' ')}
                    >
                      <span className="px-3.5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 select-none">
                        +251
                      </span>
                      <input
                        id="phoneDigits"
                        name="phoneDigits"
                        type="tel"
                        value={formData.phoneDigits}
                        onChange={handlePhoneChange}
                        placeholder="91 123 4567"
                        maxLength={9}
                        aria-invalid={Boolean(fieldErrors.phoneNumber)}
                        aria-describedby={fieldErrors.phoneNumber ? 'phone-error' : 'phone-hint'}
                        className="flex-1 px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 bg-transparent outline-none placeholder:text-slate-400"
                      />
                    </div>
                    {fieldErrors.phoneNumber ? (
                      <p id="phone-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.phoneNumber}
                      </p>
                    ) : (
                      <p id="phone-hint" className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                        9 digits starting with 9 or 7 (e.g. 91 123 4567)
                      </p>
                    )}
                  </div>

                  {/* Current Address */}
                  <div>
                    <label htmlFor="address" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Current Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Kebele, Woreda, Sub-city, City..."
                      aria-invalid={Boolean(fieldErrors.address)}
                      aria-describedby={fieldErrors.address ? 'address-error' : undefined}
                      className={[
                        'w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                        fieldErrors.address ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                      ].join(' ')}
                    />
                    {fieldErrors.address && (
                      <p id="address-error" className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Account Setup */}
            {currentStep === 2 && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#0f2d6b] dark:text-blue-200 mb-1">
                  Account Setup
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  Create a strong password to secure your account.
                </p>

                <div className="space-y-4">
                  {/* Password Field with Eye Toggle */}
                  <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby="password-strength-label"
                        className={[
                          'w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                          fieldErrors.password ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                        ].join(' ')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>

                    {/* 4-segment strength meter reflecting real backend rules */}
                    <div className="mt-2.5">
                      <div className="flex gap-1.5" aria-hidden="true">
                        {[1, 2, 3, 4].map((seg) => (
                          <div
                            key={seg}
                            className="flex-1 h-1.5 rounded-full transition-colors"
                            style={{
                              backgroundColor:
                                passwordStrength.score >= seg ? passwordStrength.color : '#e8edf5',
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between items-center mt-1.5">
                        <span id="password-strength-label" className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          Password strength:{' '}
                          <strong style={{ color: passwordStrength.score > 0 ? passwordStrength.color : undefined }}>
                            {passwordStrength.label}
                          </strong>
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                        </span>
                      </div>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field with Eye Toggle */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Repeat your password"
                        aria-invalid={Boolean(fieldErrors.confirmPassword)}
                        className={[
                          'w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] dark:focus:ring-blue-500',
                          fieldErrors.confirmPassword ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
                        ].join(' ')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    </div>
                    {formData.confirmPassword.length > 0 && (
                      <p className={`mt-1.5 text-xs font-medium ${passwordsMatch ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                        {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                    {fieldErrors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Prototype Notice Box */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/80 p-3.5 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-300 leading-relaxed">
                    By creating an account you confirm that you are an Ethiopian citizen, that all information provided is accurate, and that you consent to processing your personal data in accordance with the EthioClear Privacy Policy. EthioClear is a university academic prototype, not an official government service.
                  </div>

                  {/* Terms & Privacy Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-sm text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#0f2d6b] focus:ring-[#0f2d6b] dark:border-slate-700 dark:bg-slate-800"
                      />
                      <span className="leading-snug">
                        I agree to the{' '}
                        <Link to="/terms" target="_blank" className="font-semibold text-[#0f2d6b] dark:text-blue-400 hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" target="_blank" className="font-semibold text-[#0f2d6b] dark:text-blue-400 hover:underline">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>
                    {fieldErrors.agreeTerms && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                        {fieldErrors.agreeTerms}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Confirmation */}
            {currentStep === 3 && (
              <div className="text-center py-4 sm:py-6">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <svg
                    width="32"
                    height="32"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2d6b] dark:text-blue-200 mb-2">
                  Account Created!
                </h2>

                <p className="text-base text-slate-600 dark:text-slate-300 mb-2">
                  Welcome to EthioClear, <strong>{formData.firstName || 'Applicant'}</strong>.
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto leading-relaxed">
                  Your account is ready. You can sign in now.
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg text-sm font-semibold text-white bg-[#0f2d6b] hover:bg-[#162f7a] focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] focus:ring-offset-2 transition-all shadow-md mx-auto"
                >
                  Go to Sign In
                </button>
              </div>
            )}

            {/* Footer Navigation Buttons (Steps 0, 1, 2) */}
            {currentStep < 3 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0f2d6b] dark:hover:text-white transition-colors focus:outline-none focus:underline"
                  >
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 2 ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f2d6b] hover:bg-[#162f7a] focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] focus:ring-offset-2 transition-all shadow-sm"
                  >
                    Continue
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isStep3Valid}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0f2d6b] hover:bg-[#162f7a] focus:outline-none focus:ring-2 focus:ring-[#0f2d6b] focus:ring-offset-2 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Academic Prototype Notice & Security Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              This is an academic prototype of EthioClear. Not an official government service.
            </p>
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1">
                <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                256-bit Encrypted
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
              <span>Secure Prototype Connection</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
