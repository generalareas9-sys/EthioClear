// src/components/ui/EmptyState.jsx
// Reusable "no data found" placeholder for list pages.
// Accepts an optional icon character, a message, and an optional
// action element (e.g. a Link to create the first item).

function EmptyState({ icon = '📭', message = 'No data found.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl" role="img" aria-hidden="true">{icon}</span>
      <p className="mt-3 text-sm text-gray-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
