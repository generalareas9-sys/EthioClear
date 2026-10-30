// src/pages/auth/Login.jsx
// Redesigned EthioClear Login Page matching Figma specifications:
// - Two-column split layout with AuthLayout (navy brand left panel, clean light right panel)
// - Polished rounded-2xl white card with soft shadow and subtle border
// - Serif "Welcome back" heading & muted subtitle
// - Direct email + password authentication (no role tabs; backend determines role & redirects)
// - Accessible password visibility toggle (eye/eye-off SVG with ARIA labels)
// - Full-width navy CTA button with loading spinner state
// - Inline error banner and field validation messages
// - Auto-redirect if user is already authenticated

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useTranslation } from '../../i18n/LanguageContext.jsx';
import { ROLE_DASHBOARD_PATHS } from '../../utils/constants.js';
import { parseApiError } from '../../utils/parseApiError.js';
import { isValidEmail, isRequired } from '../../utils/validators.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';

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

function Login() {
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // If already logged in, redirect immediately to role dashboard
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const from = location.state?.from?.pathname;
      const destination = from || ROLE_DASHBOARD_PATHS[currentUser.role] || '/';
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate, location.state]);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const justRegistered = Boolean(location.state?.registered);

  function validate(data) {
    const errors = {};
    if (!isRequired(data.email)) {
      errors.email = t('auth.validation.emailRequired');
    } else if (!isValidEmail(data.email)) {
      errors.email = t('auth.validation.emailInvalid');
    }
    if (!isRequired(data.password)) {
      errors.password = t('auth.validation.passwordRequired');
    }
    return errors;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formError) {
      setFormError('');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const clientErrors = validate(formData);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      const user = await login(formData.email, formData.password);
      const from = location.state?.from?.pathname;
      const destination = from || ROLE_DASHBOARD_PATHS[user.role] || '/';
      navigate(destination, { replace: true });
    } catch (error) {
      const { message, fieldErrors: apiFieldErrors } = parseApiError(error);
      setFormError(message);
      setFieldErrors(apiFieldErrors || {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        
        {/* Card Header: Welcome back serif heading and subtitle */}
        <div className="mb-6 text-left">
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F2A6B] tracking-tight">
            {t('auth.welcomeBack')}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        {/* Successful registration notification badge */}
        {justRegistered && (
          <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-xs sm:text-sm text-emerald-800">
            {t('auth.registrationSuccessful')}
          </div>
        )}

        {/* Top-level Error Banner for failed authentication */}
        {formError && (
          <div
            role="alert"
            className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs sm:text-sm font-medium text-red-700 flex items-start gap-2.5"
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
            <div className="flex-1 leading-snug">{formError}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          
          {/* Email Address Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-semibold text-[#0F172A] mb-1.5"
            >
              {t('auth.emailAddress')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={[
                'w-full h-12 px-3.5 rounded-lg text-sm sm:text-base font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                'placeholder:text-slate-400',
                'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                fieldErrors.email
                  ? 'border-red-400 bg-red-50/30'
                  : 'border-slate-300/80 hover:border-slate-400',
              ].join(' ')}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1.5 text-xs font-medium text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password Field with visibility toggle & Forgot Password link */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-semibold text-[#0F172A]"
              >
                {t('auth.password')}
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-[#0F2A6B] hover:text-[#1E3A8A] hover:underline focus-visible:outline-[#0F2A6B] rounded"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                className={[
                  'w-full h-12 pl-3.5 pr-11 rounded-lg text-sm sm:text-base font-normal text-slate-900 bg-[#EAF0FB] border transition-colors shadow-xs',
                  'placeholder:text-slate-400',
                  'focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20',
                  fieldErrors.password
                    ? 'border-red-400 bg-red-50/30'
                    : 'border-slate-300/80 hover:border-slate-400',
                ].join(' ')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-md focus-visible:outline-[#0F2A6B]"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p id="password-error" className="mt-1.5 text-xs font-medium text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Full-width Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-[#0F2A6B]"
            >
              {isSubmitting && (
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                  role="status"
                  aria-label="Loading"
                />
              )}
              <span>{isSubmitting ? t('auth.signingIn') || 'Signing in...' : t('auth.signInButton')}</span>
            </button>
          </div>
        </form>

        {/* Divider and Register link */}
        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-xs sm:text-sm text-slate-600">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="font-bold text-[#0F2A6B] hover:text-[#1E3A8A] hover:underline focus-visible:outline-[#0F2A6B] rounded ml-1"
            >
              {t('auth.createOneFree')}
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}

export default Login;
