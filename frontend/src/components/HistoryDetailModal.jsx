import React, { useEffect } from 'react';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';

const fieldRows = [
  ['cgpa', 'CGPA'],
  ['internships', 'Internships'],
  ['projects', 'Projects'],
  ['certifications', 'Workshops/Certifications'],
  ['aptitude_score', 'Aptitude score'],
  ['soft_skills_rating', 'Soft skills rating'],
  ['extracurricular_activities', 'Extracurriculars', (v) => (v ? 'Yes' : 'No')],
  ['placement_training', 'Placement training', (v) => (v ? 'Yes' : 'No')],
  ['backlogs', 'Active backlogs'],
];

const HistoryDetailModal = ({ item, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;
  const isPlaced = item.outcome;
  const factors = item.limiting_features ? Object.entries(item.limiting_features) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 scrim scrim-enter" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md glass-card p-6 md:p-7 max-h-[85vh] overflow-y-auto page-enter">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted mb-1">{new Date(item.created_at).toLocaleString()}</p>
            <div
              className="inline-flex items-center gap-1.5 font-semibold text-sm"
              style={{ color: isPlaced ? 'var(--color-success)' : 'var(--color-danger)' }}
            >
              {isPlaced ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {isPlaced ? 'Placed' : 'Not placed'}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-panel transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5">
          <ConfidenceBadge score={item.confidence_score} />
        </div>

        <h4 className="text-xs font-semibold mb-3 text-muted uppercase tracking-wider">Profile submitted</h4>
        <div className="grid grid-cols-2 gap-y-3 gap-x-3 text-sm mb-5">
          {fieldRows.map(([key, label, fmt]) => (
            <div key={key}>
              <span className="text-muted block text-xs">{label}</span>
              <span className="font-medium text-ink">{fmt ? fmt(item[key]) : item[key]}</span>
            </div>
          ))}
        </div>

        {factors.length > 0 && (
          <>
            <h4 className="text-xs font-semibold mb-2 text-muted uppercase tracking-wider">What shaped this</h4>
            <div className="flex flex-wrap gap-2">
              {factors.map(([key, value]) => (
                <span key={key} className="chip px-3 py-1.5 text-xs">
                  <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryDetailModal;
