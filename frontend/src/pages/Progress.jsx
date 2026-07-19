import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ErrorBanner from '../components/ErrorBanner';
import ProgressChart from '../components/ProgressChart';

const Progress = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const historyData = await api.getHistory();
        setData(historyData);
        setError(null);
      } catch (err) {
        setError("couldn't load progress, please try again");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="font-display text-2xl font-semibold mb-6">Your progress</h2>
      
      {error && <ErrorBanner message={error} />}

      {!loading && !error && (
        <ProgressChart data={data} />
      )}

      {loading && (
        <div className="flex justify-center p-12 glass-panel">
          <div className="w-8 h-8 border-4 border-line border-t-blue-ink rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Progress;
