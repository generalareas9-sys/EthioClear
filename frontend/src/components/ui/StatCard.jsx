// src/components/ui/StatCard.jsx
// Upgraded StatCard matching Figma reference design:
// Uppercase category label, SVG icon on the top right, large colored stat counter,
// and progress/trend indicator (Navy for totals, Green for approved, Amber for pending, Red for rejected, Purple for users).

const COLOR_MAP = {
  navy: {
    text: 'text-[#0f2a6b]',
    iconBg: 'bg-blue-50 text-blue-700',
    bar: 'bg-[#0f2a6b]',
  },
  green: {
    text: 'text-emerald-600',
    iconBg: 'bg-emerald-50 text-emerald-700',
    bar: 'bg-emerald-600',
  },
  amber: {
    text: 'text-amber-600',
    iconBg: 'bg-amber-50 text-amber-700',
    bar: 'bg-amber-500',
  },
  red: {
    text: 'text-red-600',
    iconBg: 'bg-red-50 text-red-700',
    bar: 'bg-red-600',
  },
  purple: {
    text: 'text-purple-600',
    iconBg: 'bg-purple-50 text-purple-700',
    bar: 'bg-purple-600',
  },
};

function DefaultIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  color = 'navy',
  caption = '',
  icon: Icon = null,
  progress = null,
}) {
  const scheme = COLOR_MAP[color] || COLOR_MAP.navy;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border-theme bg-card p-5 shadow-sm transition-all duration-150 hover:shadow-md">
      {/* Top Header: Label & Top Right Icon */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
          {label}
        </p>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${scheme.iconBg}`}>
          {Icon ? <Icon className="h-5 w-5" /> : <DefaultIcon />}
        </div>
      </div>

      {/* Main Stat Number */}
      <div className="my-2">
        <p className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${scheme.text}`}>
          {value ?? 0}
        </p>
      </div>

      {/* Optional Progress Bar or Caption */}
      {typeof progress === 'number' && (
        <div className="mt-2 w-full">
          <div className="h-1.5 w-full rounded-full bg-card-subtle overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${scheme.bar}`}
              style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            />
          </div>
        </div>
      )}

      {caption && (
        <p className="mt-1 text-xs text-text-muted font-medium">
          {caption}
        </p>
      )}
    </div>
  );
}

export default StatCard;
