import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, History, Settings, LogOut } from 'lucide-react';

const Drawer = ({ open, onClose, user, onLogout }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const initials = (user?.name || user?.email || '?').charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 scrim scrim-enter" onClick={onClose} />
      <aside className="absolute top-0 right-0 h-full w-full max-w-xs surface-card rounded-l-card rounded-r-none
        border-r-0 flex flex-col drawer-enter">
        <div className="flex items-center justify-between p-5 border-b border-line">
          <span className="font-display font-semibold text-ink">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-panel transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Name plate / ID card */}
        <div className="p-5">
          <div className="flex items-center gap-3 chip px-4 py-3.5">
            <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center font-display
              font-semibold text-lg shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{user?.name || 'Student'}</p>
              <p className="text-xs opacity-80 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3">
          <Link
            to="/history"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-ink
              hover:bg-panel transition-colors"
          >
            <History size={18} /> History
          </Link>
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-ink
              hover:bg-panel transition-colors"
          >
            <Settings size={18} /> Settings
          </Link>
        </nav>

        <div className="p-3 border-t border-line">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium
              hover:bg-danger-bg transition-colors"
            style={{ color: 'var(--color-danger)' }}
          >
            <LogOut size={18} /> Log out
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Drawer;
