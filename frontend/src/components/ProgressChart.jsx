import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import EmptyState from './EmptyState';
import { TrendingUp } from 'lucide-react';

const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  const color = payload.outcome ? 'var(--color-success)' : 'var(--color-danger)';
  return (
    <circle cx={cx} cy={cy} r={6} fill={color} stroke="var(--color-card)" strokeWidth={2} />
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div className="surface-card px-4 py-3 text-sm">
      <p className="text-muted mb-1">{p.date}</p>
      <p className="font-semibold" style={{ color: p.outcome ? 'var(--color-success)' : 'var(--color-danger)' }}>
        {p.outcome ? 'Placed' : 'Not placed'} · {p.score}%
      </p>
    </div>
  );
};

const ProgressChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <EmptyState message="No predictions yet — submit your profile to start your chart" icon={TrendingUp} />;
  }

  if (data.length === 1) {
    return (
      <div className="p-8 text-center">
        <p className="font-display text-3xl font-semibold font-mono-readout text-ink mb-1">
          {Math.round(data[0].confidence_score * 100)}%
        </p>
        <p className="text-muted text-sm">Your first prediction. Submit more to see a trend.</p>
      </div>
    );
  }

  // Chronological order, points spaced evenly on the X-axis (category axis) —
  // the date label is display-only and doesn't drive point spacing.
  const chartData = data
    .map((item) => ({
      ...item,
      score: Math.round(item.confidence_score * 100),
      date: new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }))
    .reverse();

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-line)" vertical={false} />
          <XAxis
            dataKey="date"
            type="category"
            stroke="var(--color-muted)"
            tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
            axisLine={{ stroke: 'var(--color-line)' }}
            tickLine={false}
          />
          <YAxis
            stroke="var(--color-muted)"
            tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
          />
          <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-line-strong)' }} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--color-primary-to)"
            strokeWidth={3}
            dot={<CustomDot />}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
