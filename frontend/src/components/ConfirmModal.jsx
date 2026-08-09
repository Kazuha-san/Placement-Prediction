import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

/**
 * Generic yes/no confirmation modal. Portalled to document.body so it always
 * covers the full viewport regardless of where it's rendered from (see the
 * History modal fix - nesting a `position: fixed` modal inside a transformed
 * page wrapper clips it to that wrapper's box instead of the real viewport).
 */
const ConfirmModal = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  error = null,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !loading && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel, loading]);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 scrim scrim-enter" onClick={!loading ? onCancel : undefined} />
      <div className="relative z-10 w-full max-w-sm glass-card p-6 page-enter">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{
              background: danger ? 'var(--color-danger-bg)' : 'var(--color-panel)',
              color: danger ? 'var(--color-danger)' : 'var(--color-ink)',
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
            <p className="text-sm text-muted mt-1">{message}</p>
          </div>
        </div>

        {error && <p className="text-xs text-danger font-medium mb-3">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-pill text-sm font-semibold text-white disabled:opacity-60 order-1 sm:order-2 flex-1"
            style={{ background: danger ? 'var(--color-danger)' : 'var(--color-primary-to)' }}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary px-5 py-2.5 text-sm font-medium disabled:opacity-60 order-2 sm:order-1 flex-1"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
