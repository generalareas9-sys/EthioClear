// src/components/common/Button.jsx
// Reusable button with accessible contrast, min-44px touch targets on mobile, and theme support.

import LoadingSpinner from './LoadingSpinner.jsx';

const VARIANT_CLASSES = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 focus-visible:outline-primary-700 shadow-sm',
  secondary: 'bg-secondary-700 text-white hover:bg-secondary-800 focus-visible:outline-secondary-700 shadow-sm',
  outline: 'bg-surface text-text-primary border border-border-theme hover:bg-card-subtle focus-visible:outline-primary-600 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 shadow-sm',
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
    ? { borderColor: 'var(--color-border-focus)', borderTopColor: 'transparent' }
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
      ].join(' ')}
      {...rest}
    >
      {isLoading && <LoadingSpinner size="sm" label="Loading" style={spinnerStyle} />}
      {children}
    </button>
  );
}

export default Button;
