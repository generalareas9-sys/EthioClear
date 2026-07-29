// src/components/common/Card.jsx
// Simple bordered container used throughout the dashboards for
// grouping content (stat tiles, forms, list items, etc.).

function Card({ title, children, className = '', bodyClassName = '' }) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {title && (
        <div className="border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      <div className={`p-4 ${bodyClassName}`}>{children}</div>
    </div>
  );
}

export default Card;
