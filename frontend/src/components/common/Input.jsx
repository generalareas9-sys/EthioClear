// src/components/common/Input.jsx
// Reusable labeled text input with accessible errors, responsive touch targets, and full theme token support.

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
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs sm:text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500 font-bold"> *</span>}
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
          'block w-full min-h-[44px] rounded-lg border px-3.5 py-2.5 text-sm sm:text-base shadow-sm transition-colors',
          'placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          error
            ? 'border-red-400 bg-red-50/20 text-text-primary'
            : 'border-border-theme bg-surface text-text-primary hover:border-border-subtle',
          disabled
            ? 'bg-card-subtle text-text-muted cursor-not-allowed opacity-75'
            : '',
        ].join(' ')}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
