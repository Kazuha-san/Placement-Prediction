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
      <div className="h-64 flex items-center justify-center p-6 glass-panel text-center">
        <div>
          <p className="font-display text-xl font-semibold mb-2 font-mono-readout">First prediction score: {Math.round(data[0].confidence_score * 100)}%</p>
          <p className="text-muted">Submit more predictions over time to see your progress chart!</p>
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
    <div className="h-80 w-full p-4 glass-panel">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E9E1D2" />
          <XAxis dataKey="date" stroke="#82796C" tick={{ fill: '#82796C', fontSize: 12 }} />
          <YAxis stroke="#82796C" tick={{ fill: '#82796C', fontSize: 12 }} domain={[0, 100]} />
          <RechartsTooltip 
            contentStyle={{ backgroundColor: '#2E2A25', border: 'none', borderRadius: '12px', color: '#FFFCF7' }}
          />
          <Line type="monotone" dataKey="score" stroke="#4A3B7A" strokeWidth={3} dot={{ r: 4, fill: '#4A3B7A' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
