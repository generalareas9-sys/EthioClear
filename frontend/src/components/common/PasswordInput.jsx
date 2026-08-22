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
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-[var(--site-foreground)]">
          {label}
          {required && <span className="text-red-600"> *</span>}
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
            'block w-full rounded-md border px-3 py-2 text-sm shadow-sm pr-10',
            'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
            'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400',
            error ? 'border-red-400 focus-visible:outline-red-500' : 'border-gray-300 focus-visible:outline-primary-600',
            'bg-[var(--site-bg-weak)] text-[var(--site-foreground)]',
          ].join(' ')}
        />

        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:text-gray-700 dark:text-slate-300 dark:hover:text-slate-100"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
