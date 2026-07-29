// src/components/common/Button.jsx
// Reusable button. Supports a few visual variants and an optional
// loading state (shows a spinner and disables the button).

import LoadingSpinner from './LoadingSpinner.jsx';

const VARIANT_CLASSES = {
  primary: 'bg-primary-700 text-white hover:bg-primary-800 focus-visible:outline-primary-700',
  secondary: 'bg-secondary-700 text-white hover:bg-secondary-800 focus-visible:outline-secondary-700',
  outline: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
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
  // Outline is the only variant with a light background — every other
  // variant needs a white spinner to stay visible against its fill color.
  const spinnerColorClass = variant === 'outline' ? 'border-primary-600' : 'border-white';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClass,
        sizeClass,
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {isLoading && <LoadingSpinner size="sm" label="Loading" colorClass={spinnerColorClass} />}
      {children}
    </button>
  );
}

export default Button;
