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
      <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
      
      {error && <ErrorBanner message={error} />}

      {!loading && !error && (
        <ProgressChart data={data} />
      )}

      {loading && (
        <div className="flex justify-center p-12 glass-panel rounded-xl">
          <div className="w-8 h-8 border-4 border-color-surface-light border-t-color-primary rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default Progress;
