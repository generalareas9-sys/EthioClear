// src/components/ui/Pagination.jsx
// Responsive pagination controls with min-44px touch targets.

import Button from '../common/Button.jsx';

function Pagination({ page, totalPages, onPageChange, isLoading = false }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border-theme">
      <p className="text-xs text-text-muted font-medium">
        Page <span className="font-bold text-text-primary">{page}</span> of{' '}
        <span className="font-bold text-text-primary">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          ‹ Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Next ›
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
