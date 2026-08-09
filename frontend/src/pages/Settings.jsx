import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { User, Palette, ShieldAlert, Sun, Moon, Check } from 'lucide-react';
import BackButton from '../components/BackButton';
import ConfirmModal from '../components/ConfirmModal';

const SectionHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="chip p-2.5"><Icon size={18} /></div>
    <div>
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
    </div>
  </div>
);

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  // Delete-account is now a separate modal, not an in-place button swap -
  // the old version replaced "Delete my account" with "Yes, permanently
  // delete" in the exact same spot, which invited misclicks from people
  // clicking without reading. A modal forces a deliberate, separate action.
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const handleSaveName = async (e) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    try {
      await api.updateProfile({ display_name: displayName.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save name');
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await api.deleteAccount();
      await logout();
      window.location.href = '/';
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete account');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 page-enter">
      <BackButton to="/profile" />
      <h1 className="font-display text-2xl font-semibold text-ink mb-8">Settings</h1>

      {/* ---------- General ---------- */}
      <section className="surface-card p-6 md:p-7 mb-6">
        <SectionHeading icon={User} title="General" />

        <form onSubmit={handleSaveName} className="mb-6">
          <label htmlFor="displayName" className="block text-sm font-semibold text-ink mb-1.5">
            Display name
          </label>
          <div className="flex gap-2">
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={`flex-1 px-4 py-2.5 bg-card border-2 rounded-2xl focus:outline-none
                focus:ring-2 focus:ring-[var(--color-primary-to)] focus:border-transparent transition-colors
                ${error ? 'border-danger' : 'border-line focus:border-transparent'}`}
            />
            <button type="submit" className="btn-primary px-5 font-medium text-sm shrink-0 flex items-center gap-1.5">
              {saved ? <><Check size={16} /> Saved</> : 'Save'}
            </button>
          </div>
          {error && (
            <p className="mt-1 text-xs text-danger font-medium">{error}</p>
          )}
        </form>

        <div className="grid grid-cols-2 gap-4 pt-5 border-t border-line">
          <div>
            <p className="text-xs text-muted mb-1">Email</p>
            <p className="text-sm font-medium text-ink">{user?.email || '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted mb-1">Date joined</p>
            <p className="text-sm font-medium text-ink">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Appearance ---------- */}
      <section className="surface-card p-6 md:p-7 mb-6">
        <SectionHeading icon={Palette} title="Appearance" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ink">Theme</p>
            <p className="text-xs text-muted">Switch between light and dark mode</p>
          </div>
          <div className="flex items-center bg-panel rounded-pill p-1 border border-line">
            <button
              onClick={() => setTheme('light')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-sm font-medium transition-colors"
              style={theme === 'light' ? { background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' } : {}}
            >
              <Sun size={15} /> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-pill text-sm font-medium transition-colors"
              style={theme === 'dark' ? { background: 'var(--color-card)', boxShadow: 'var(--shadow-card)' } : {}}
            >
              <Moon size={15} /> Dark
            </button>
          </div>
        </div>
      </section>

      {/* ---------- Account (danger zone) ---------- */}
      <section className="p-6 md:p-7 rounded-card border-2 border-danger-line" style={{ background: 'var(--color-danger-bg)' }}>
        <SectionHeading icon={ShieldAlert} title="Account" subtitle="Danger zone" />
        <p className="text-sm text-muted mb-4">
          Permanently deleting your account removes your profile and all saved prediction history.
          This can't be undone.
        </p>
        <button
          onClick={() => {
            setDeleteError(null);
            setDeleteModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-pill text-sm font-semibold border-2"
          style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger-line)' }}
        >
          Delete my account
        </button>
      </section>

      {deleteModalOpen && (
        <ConfirmModal
          title="Delete your account?"
          message="This permanently removes your profile and all saved prediction history. This can't be undone."
          confirmLabel="Yes, permanently delete"
          cancelLabel="Cancel"
          danger
          loading={deleteLoading}
          error={deleteError}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!deleteLoading) setDeleteModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Settings;
