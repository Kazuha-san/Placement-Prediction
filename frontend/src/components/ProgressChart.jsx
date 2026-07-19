import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import EmptyState from './EmptyState';

const ProgressChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <EmptyState message="No data available for chart. Keep predicting!" />
      </div>
    );
  }

  if (data.length === 1) {
    return (
      <div className="h-64 flex items-center justify-center p-6 bg-color-surface-light rounded-xl border border-color-surface-light glass-panel text-center">
        <div>
          <p className="text-xl font-semibold mb-2">First Prediction Score: {Math.round(data[0].confidence_score * 100)}%</p>
          <p className="text-color-text-muted">Submit more predictions over time to see your progress chart!</p>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    score: Math.round(item.confidence_score * 100),
    date: new Date(item.created_at).toLocaleDateString()
  })).reverse(); // Assuming backend gives reverse chronological, chart should be chronological

  return (
    <div className="h-80 w-full p-4 bg-color-surface-light rounded-xl glass-panel">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#94a3b8'}} />
          <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} domain={[0, 100]} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
          />
          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
