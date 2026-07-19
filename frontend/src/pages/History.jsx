import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';
import ConfidenceBadge from '../components/ConfidenceBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';

const HistoryItem = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const isPlaced = item.outcome;

  return (
    <div className="border border-color-surface-light rounded-xl bg-color-surface-light/50 mb-4 overflow-hidden transition-all">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-color-surface-light"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="text-sm text-color-text-muted mb-1">
            {new Date(item.created_at).toLocaleString()}
          </div>
          <div className="font-semibold text-lg flex items-center gap-3">
            <span className={isPlaced ? 'text-green-400' : 'text-red-400'}>
              {isPlaced ? 'Placed' : 'Not Placed'}
            </span>
            <ConfidenceBadge score={item.confidence_score} />
          </div>
        </div>
        <div>
          {expanded ? <ChevronUp className="text-color-text-muted" /> : <ChevronDown className="text-color-text-muted" />}
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 border-t border-color-surface-light bg-color-background/50">
          <h4 className="text-sm font-semibold mb-3 text-color-text-muted uppercase tracking-wider">Profile Submitted</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-sm mb-4">
            <div><span className="text-color-text-muted block">CGPA:</span> {item.cgpa}</div>
            <div><span className="text-color-text-muted block">Internships:</span> {item.internships}</div>
            <div><span className="text-color-text-muted block">Projects:</span> {item.projects}</div>
            <div><span className="text-color-text-muted block">Certifications:</span> {item.certifications}</div>
            <div><span className="text-color-text-muted block">Aptitude Score:</span> {item.aptitude_score}</div>
            <div><span className="text-color-text-muted block">Soft Skills:</span> {item.soft_skills_rating}</div>
            <div><span className="text-color-text-muted block">Extracurriculars:</span> {item.extracurricular_activities ? 'Yes' : 'No'}</div>
            <div><span className="text-color-text-muted block">Training:</span> {item.placement_training ? 'Yes' : 'No'}</div>
            <div><span className="text-color-text-muted block">Backlogs:</span> {item.backlogs}</div>
          </div>
          
          {item.limiting_features && Object.keys(item.limiting_features).length > 0 && (
            <>
              <h4 className="text-sm font-semibold mb-2 text-color-text-muted uppercase tracking-wider">Limiting Features</h4>
              <ul className="list-disc pl-5 text-sm text-color-text-main space-y-1">
                {Object.entries(item.limiting_features).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory();
        setHistory(data);
        setError(null);
      } catch (err) {
        setError("couldn't load history, please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Prediction History</h2>
      
      {error && <ErrorBanner message={error} />}
      
      {!loading && !error && history.length === 0 && (
        <EmptyState message="No predictions yet — submit your profile to get started" />
      )}

      {!loading && history.map(item => (
        <HistoryItem key={item.id} item={item} />
      ))}

      {loading && (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-color-surface-light border-t-color-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default History;
