// src/components/common/Input.jsx
// Reusable labeled text input with optional error message and
// required-field indicator. Fully controlled — expects `value` and
// `onChange` from the parent.

function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...rest
}) {
  const inputId = id || name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700 dark:text-slate-200">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={[
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm',
          'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-400',
          error
            ? 'border-red-400 focus-visible:outline-red-500'
            : 'border-gray-300 focus-visible:outline-primary-600',
          disabled ? 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400' : 'bg-[var(--site-bg-weak)] text-[var(--site-foreground)]',
        ].join(' ')}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
