// src/components/ui/Pagination.jsx
// Simple previous/next pagination control. Generic — takes the
// current page, total pages, and a change handler; used by
// ApplicationsList.jsx and reusable later for officer/admin lists.

import Button from '../common/Button.jsx';

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-2 py-3">
      <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}

export default Pagination;
