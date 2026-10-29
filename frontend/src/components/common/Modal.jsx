// src/components/common/Modal.jsx
// Reusable modal dialog with internal scrolling, responsive sizing, and full keyboard escape support.

import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) {
  // Close on Escape key while the modal is open.
  useEffect(() => {
    if (!isOpen) return undefined;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className={`w-full ${maxWidth} my-8 flex flex-col rounded-2xl border border-border-theme bg-surface text-text-primary shadow-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150`}
        // Stop backdrop click-to-close from firing when clicking inside the dialog itself.
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-theme px-5 py-4 shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-text-primary">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-card-subtle hover:text-text-primary transition-colors focus-visible:outline-primary-600"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="px-5 py-5 overflow-y-auto flex-1 text-sm leading-relaxed text-text-secondary">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-border-theme px-5 py-3.5 bg-card-subtle/50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
