// src/components/ui/StatusBadge.jsx
// Status pill with soft colored background, border, matching dot indicator, and dark mode support.
// Covers: Approved green, Rejected red, Under Review blue, Pending amber, Certificate Issued indigo.

function getBadgeVariant(label = '', badgeClass = '') {
  const text = (label || '').toLowerCase();

  if (text.includes('approved') || text.includes('verified') || text.includes('active')) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dot-emerald';
  }
  if (text.includes('rejected') || text.includes('suspended')) {
    return 'bg-red-50 text-red-700 border-red-200 dot-red';
  }
  if (text.includes('review') || text.includes('submitted')) {
    return 'bg-blue-50 text-blue-700 border-blue-200 dot-blue';
  }
  if (text.includes('pending')) {
    return 'bg-amber-50 text-amber-700 border-amber-200 dot-amber';
  }
  if (text.includes('certificate') || text.includes('issued')) {
    return 'bg-indigo-50 text-indigo-700 border-indigo-200 dot-indigo';
  }

  // Fallback to existing badgeClass or gray
  return badgeClass || 'bg-slate-100 text-slate-700 border-slate-200 dot-slate';
}

function StatusBadge({ label, badgeClass = '' }) {
  const variant = getBadgeVariant(label, badgeClass);

  // Extract dot color
  let dotBg = 'bg-slate-400';
  if (variant.includes('dot-emerald')) dotBg = 'bg-emerald-500';
  if (variant.includes('dot-red')) dotBg = 'bg-red-500';
  if (variant.includes('dot-blue')) dotBg = 'bg-blue-500';
  if (variant.includes('dot-amber')) dotBg = 'bg-amber-500';
  if (variant.includes('dot-indigo')) dotBg = 'bg-indigo-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-xs transition-colors ${variant}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotBg}`} />
      <span>{label}</span>
    </span>
  );
}

export default StatusBadge;
