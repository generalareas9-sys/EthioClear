// src/components/common/Button.jsx
// Reusable button with accessible contrast, min-44px touch targets on mobile, and light theme support.

import LoadingSpinner from './LoadingSpinner.jsx';

const VARIANT_CLASSES = {
  primary: 'bg-[#0F2A6B] text-white hover:bg-[#1E3A8A] focus-visible:outline-[#0F2A6B] shadow-xs',
  secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-emerald-600 shadow-xs',
  outline: 'bg-transparent text-slate-800 border border-slate-300 hover:bg-slate-100 focus-visible:outline-[#0F2A6B] shadow-xs',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 shadow-xs',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-xs sm:text-sm min-h-[36px]',
  md: 'px-4 py-2 text-sm sm:text-base min-h-[44px]',
  lg: 'px-5 py-2.5 text-base min-h-[48px]',
};

/**
 * @param {'primary'|'secondary'|'outline'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} isLoading - shows a spinner and disables the button
 * @param {boolean} fullWidth
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled = false,
  type = 'button',
  className = '',
  ...rest
}) {
  const variantClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary;
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const spinnerStyle = variant === 'outline'
    ? { borderColor: '#0F2A6B', borderTopColor: 'transparent' }
    : { borderColor: 'white', borderTopColor: 'transparent' };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors select-none',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClass,
        sizeClass,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {isLoading && (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid"
          style={spinnerStyle}
          role="status"
          aria-label="Loading"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
