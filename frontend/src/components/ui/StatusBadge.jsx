// src/components/ui/StatusBadge.jsx
// Small colored pill for displaying a status value. Generic by
// design — takes the already-resolved label/color classes rather than
// a raw status string, so it can be reused for application statuses,
// document statuses, or anything else with a status-to-color mapping
// (see utils/constants.js: APPLICATION_STATUS_META, DOCUMENT_STATUS_META).

function StatusBadge({ label, badgeClass }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
        badgeClass || 'bg-gray-100 text-gray-700'
      }`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
