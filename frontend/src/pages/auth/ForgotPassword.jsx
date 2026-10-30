// src/pages/auth/ForgotPassword.jsx
// Redesigned Forgot Password page matching Figma split-screen architecture

import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import AuthLayout from '../../components/layout/AuthLayout.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/password-reset/request', { email });
      setMessage('If an account with that email exists, password reset instructions have been sent.');
    } catch (err) {
      setError('Unable to send password reset. Please try again later.');
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
            Reset Password
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#475569]">
            Enter your email to receive password reset instructions.
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
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#0F172A] mb-1.5">
              Email Address <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-3.5 rounded-lg text-sm sm:text-base font-normal text-slate-900 bg-[#EAF0FB] border border-slate-300/80 hover:border-slate-400 focus:outline-none focus:bg-white focus:border-[#0F2A6B] focus:ring-2 focus:ring-[#0F2A6B]/20 transition-colors shadow-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-[#0F2A6B] hover:bg-[#1E3A8A] text-white font-bold text-sm sm:text-base shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-[#0F2A6B]"
            >
              {isSubmitting && (
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"
                  role="status"
                  aria-label="Loading"
                />
              )}
              <span>{isSubmitting ? 'Sending instructions...' : 'Send Reset Email'}</span>
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
