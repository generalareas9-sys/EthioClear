// src/components/common/Card.jsx
// Bordered container with theme tokens and flexible padding for responsive layouts.

function Card({ title, children, className = '', bodyClassName = '', headerRight = null }) {
  return (
    <div className={`rounded-xl border border-border-theme bg-card text-text-primary shadow-sm transition-colors duration-150 ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-border-theme px-4 py-3 sm:px-6">
          <h3 className="text-base font-semibold text-text-primary">{title}</h3>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className={`p-4 sm:p-6 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

export default Card;
