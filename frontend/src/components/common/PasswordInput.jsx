// src/components/common/PasswordInput.jsx
// Password input with visibility toggle, minimum 44px tap target, and theme tokens.

import { useState } from 'react';

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

export default function PasswordInput({ label, id, name, value, onChange, placeholder, error, required }) {
  const [show, setShow] = useState(false);
  const inputId = id || name;

  return (
    <div className="relative w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs sm:text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 font-bold"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={[
            'block w-full min-h-[44px] rounded-lg border px-3.5 py-2.5 pr-11 text-sm sm:text-base shadow-sm transition-colors',
            'placeholder:text-text-muted',
            'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
            error
              ? 'border-red-400 bg-red-50/20 text-text-primary'
              : 'border-border-theme bg-surface text-text-primary hover:border-border-subtle',
          ].join(' ')}
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:text-text-primary focus-visible:outline-primary-600"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
        </button>
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
