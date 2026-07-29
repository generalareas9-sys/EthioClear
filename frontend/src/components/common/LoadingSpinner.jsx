// src/components/common/LoadingSpinner.jsx
// Small reusable loading indicator. Used for full-page loading states
// (e.g. while AuthContext checks localStorage) and inline within
// buttons/cards later on.

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
};

/**
 * @param {'sm'|'md'|'lg'} size
 * @param {string} label - accessible label for screen readers
 * @param {string} colorClass - Tailwind border-color class (defaults to the primary brand color; pass 'border-white' for use on a dark/colored button background)
 */
function LoadingSpinner({ size = 'md', label = 'Loading…', colorClass = 'border-primary-600' }) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <div role="status" className="inline-flex items-center justify-center">
      <span className={`${sizeClass} ${colorClass} animate-spin rounded-full border-t-transparent`} />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default LoadingSpinner;
