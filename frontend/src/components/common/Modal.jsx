// src/components/common/Modal.jsx
// Reusable modal dialog. Closes on Escape key or backdrop click.
// Controlled entirely by the parent via `isOpen` / `onClose`.

import { useEffect } from 'react';

function Modal({ isOpen, onClose, title, children, footer }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-[var(--site-bg-weak)] shadow-lg dark:bg-slate-900 dark:text-slate-100"
        // Stop backdrop click-to-close from firing when clicking inside the dialog itself.
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-slate-700">
          <h2 className="text-base font-semibold text-[var(--site-foreground)]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-4">{children}</div>

        {footer && <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3 dark:border-slate-700">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
