import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import ProgressChart from '../components/ProgressChart';
import HistoryDetailModal from '../components/HistoryDetailModal';
import { ChevronDown, CheckCircle2, XCircle, History as HistoryIcon } from 'lucide-react';
import BackButton from '../components/BackButton';

const HistoryRow = ({ item, onOpen }) => {
  const isPlaced = item.outcome;
  return (
    <button
      onClick={() => onOpen(item)}
      className="w-full flex items-center justify-between gap-3 surface-card px-5 py-4 text-left
        hover:border-line-strong transition-colors mb-3"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: isPlaced ? 'var(--color-success-bg)' : 'var(--color-danger-bg)' }}
        >
          {isPlaced
            ? <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />
            : <XCircle size={18} style={{ color: 'var(--color-danger)' }} />}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted">{new Date(item.created_at).toLocaleDateString()}</p>
          <p className="font-semibold text-ink text-sm truncate">
            {isPlaced ? 'Placed' : 'Not placed'}
          </p>
        </div>
      </div>
      <span className="font-mono-readout font-semibold text-sm shrink-0">
        {Math.round(item.confidence_score * 100)}%
      </span>
    </button>
  );
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartOpen, setChartOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setHistory(data);
        setError(null);
      } catch (err) {
        setError("Couldn't load history, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 page-enter">
      <BackButton to="/profile" />
      <h1 className="font-display text-2xl font-semibold text-ink mb-6">History & progress</h1>

      {error && <ErrorBanner message={error} />}

      {loading && (
        <div className="flex justify-center p-16">
          <div className="w-8 h-8 border-4 border-line rounded-full animate-spin"
            style={{ borderTopColor: 'var(--color-primary-to)' }} />
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Collapsible chart */}
          <div className="surface-card mb-6 overflow-hidden">
            <button
              onClick={() => setChartOpen((o) => !o)}
              className="w-full flex items-center justify-between px-6 py-4"
            >
              <span className="font-display font-semibold text-ink">Confidence over time</span>
              <ChevronDown
                size={18}
                className="text-muted transition-transform duration-200"
                style={{ transform: chartOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: chartOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="px-4 pb-4">
                  <ProgressChart data={history} />
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          {history.length === 0 ? (
            <EmptyState message="No predictions yet — submit your profile to get started" icon={HistoryIcon} />
          ) : (
            history.map((item) => <HistoryRow key={item.id} item={item} onOpen={setActiveItem} />)
          )}
        </>
      )}

      <HistoryDetailModal item={activeItem} onClose={() => setActiveItem(null)} />
    </div>
  );
};

export default History;
