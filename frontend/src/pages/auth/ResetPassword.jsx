// src/pages/auth/ResetPassword.jsx
// Redesigned Set New Password page matching Figma split-screen architecture

import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
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

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Password reset link is missing or invalid. Please request a new link.');
    }
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password) {
      setError('Please enter a new password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters in length.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/auth/password-reset/confirm', { token, password });
      setMessage('Your password has been reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2200);
    } catch (err) {
      setError('Unable to reset password. The link may have expired or is invalid.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const topAction = (
    <div className="flex items-center gap-2">
      <Link
        to="/login"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F2A6B] hover:text-[#1E3A8A] hover:underline focus-visible:outline-[#0F2A6B] rounded px-1.5 py-0.5"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>Back to Login</span>
      </Link>
    </div>
  );

  return (
    <AuthLayout topAction={topAction} cardMaxWidth="max-w-[440px]">
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8">
        
        {/* Card Header */}
        <div className="mb-6 text-left">
          <h1 className="font-serif text-2xl sm:text-3xl font-normal text-[#0F2A6B] tracking-tight">
            Set New Password
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
            Create a secure password for your EthioClear account.
          </p>
        </div>

        {/* Success message banner */}
        {message && (
          <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 p-3.5 text-xs sm:text-sm text-emerald-800 flex items-start gap-2.5">
            <svg className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 leading-snug">{message}</div>
          </div>
        )}

        {/* Error alert banner */}
        {error && (
          <div role="alert" className="mb-5 rounded-lg bg-red-50 border border-red-200 p-3.5 text-xs sm:text-sm font-medium text-red-700 flex items-start gap-2.5">
            <svg className="h-5 w-5 shrink-0 text-red-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="flex-1 leading-snug">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-xs sm:text-sm font-semibold text-[#0F172A] mb-1.5">
              New Password <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-3.5 pr-11 rounded-lg text-sm sm:text-base font-normal text-slate-900 bg-[#EAF0FB] border border-slate-300/80 hover:border-slate-400 focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20 transition-colors shadow-xs"
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
          </div>

          <div>
            <label htmlFor="confirmNewPassword" className="block text-xs sm:text-sm font-semibold text-[#0F172A] mb-1.5">
              Confirm New Password <span className="text-red-500 font-bold">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full h-12 pl-3.5 pr-11 rounded-lg text-sm sm:text-base font-normal text-slate-900 bg-[#EAF0FB] border border-slate-300/80 hover:border-slate-400 focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20 transition-colors shadow-xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-800 rounded-md focus-visible:outline-[#0F2A6B]"
              >
                {showConfirm ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-[#0F2A6B]"
            >
              {isSubmitting && (
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                  role="status"
                  aria-label="Loading"
                />
              )}
              <span>{isSubmitting ? 'Updating password...' : 'Save New Password'}</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-xs sm:text-sm text-slate-600">
            Remembered your password?{' '}
            <Link to="/login" className="font-bold text-[#0F2A6B] hover:underline ml-1">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </AuthLayout>
  );
}
