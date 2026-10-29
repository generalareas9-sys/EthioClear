// src/components/ui/EmptyState.jsx
// Empty state block with clean icon, heading, and description.

function EmptyState({
  title = 'No items found',
  description = 'There are no records matching your request at this time.',
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border-subtle bg-card-subtle/40 p-8 text-center sm:p-12">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border-theme text-text-muted shadow-sm mb-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7 text-text-muted">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1">{title}</h3>
      <p className="max-w-sm text-xs sm:text-sm text-text-muted leading-relaxed mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

export default EmptyState;
