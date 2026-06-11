import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Zap } from 'lucide-react';
import { getProgressData, formatCurrency } from '../utils/calculations.js';

export default function Progress({ timeMode, onTimeModeChange, startups, endDate, currentRevenue, onEditNetworth }) {
  const progress = getProgressData(timeMode, endDate);

  const completedStartups = startups.filter((s) => s.status === 'completed').length;

  const modeLabels = { days: 'Days', weeks: 'Weeks', months: 'Months' };

  const getSubLabel = () => {
    if (timeMode === 'days') return '122nd day going on';
    if (timeMode === 'weeks') return '18th week going on';
    if (timeMode === 'months') return '5th month going on';
    return '';
  };

  const stats = [
    {
      icon: <Clock size={16} />,
      label: modeLabels[timeMode],
      value: `${progress.elapsed} / ${progress.total}`,
      sub: getSubLabel(),
      color: '#6366f1',
    },
    {
      icon: <Zap size={16} />,
      label: 'Startups',
      value: `${completedStartups} shipped`,
      sub: null,
      color: '#22c55e',
    },
    {
      icon: <TrendingUp size={16} />,
      label: 'Total Earning',
      value: formatCurrency(currentRevenue),
      sub: 'Click to edit ✏️',
      color: '#f59e0b',
      onClick: onEditNetworth,
    },
  ];

  return (
    <section style={{ marginTop: '24px' }} id="progress-section">
      {/* Section header with dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} style={{ color: 'var(--accent-primary)' }} />
          <span className="section-label" style={{ marginBottom: 0 }}>Journey Progress</span>
        </div>

        <select
          className="custom-select"
          value={timeMode}
          onChange={(e) => onTimeModeChange(e.target.value)}
          id="time-mode-select"
        >
          <option value="days">Days</option>
          <option value="weeks">Weeks</option>
          <option value="months">Months</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            whileHover={stat.onClick ? { scale: 1.02, y: -2 } : {}}
            onClick={stat.onClick}
            style={{
              padding: '16px 20px',
              cursor: stat.onClick ? 'pointer' : 'default',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: `${stat.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color,
              }}>
                {stat.icon}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {stat.label}
              </span>
            </div>
            <div className="mono" style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>
              {stat.value}
            </div>
            {stat.sub && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {stat.sub}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
