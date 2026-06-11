import { motion } from 'framer-motion';
import { Target, Plus, ChevronRight, Repeat, Calendar, Telescope, AlertTriangle } from 'lucide-react';

const typeIcons = {
  monthly: <Repeat size={12} />,
  fixed: <Calendar size={12} />,
  longterm: <Telescope size={12} />,
};

const typeLabels = {
  monthly: 'Monthly',
  fixed: 'Fixed Date',
  longterm: 'Long-term',
};

const typeColors = {
  monthly: '#6366f1',
  fixed: '#f59e0b',
  longterm: '#06b6d4',
};

export default function Goals({ goals, expiredGoals, onAddGoal, onGoalClick }) {
  return (
    <>
      {/* ── Active Goals ── */}
      <section style={{ marginTop: '32px' }} id="goals-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={16} style={{ color: 'var(--accent-primary)' }} />
            <span className="section-label" style={{ marginBottom: 0 }}>Goals & Resolutions</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-btn"
            onClick={onAddGoal}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px' }}
            id="add-goal-btn"
          >
            <Plus size={14} />
            Add Goal
          </motion.button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
          {goals.map((goal, idx) => {
            const progress = Math.min((goal.current / goal.target) * 100, 100);
            const color = typeColors[goal.type] || '#6366f1';
            const isUrgent = new Date(goal.deadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            return (
              <motion.div
                key={goal.id}
                className="glass-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onGoalClick(goal)}
                style={{
                  padding: '18px 20px',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${color}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {isUrgent && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--danger)',
                    boxShadow: '0 0 8px var(--danger)',
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', lineHeight: 1.3 }}>
                      {goal.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '100px',
                        background: `${color}15`,
                        color: color,
                        fontWeight: 600,
                      }}>
                        {typeIcons[goal.type]} {typeLabels[goal.type]}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>Due: {goal.deadline}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: '2px' }} />
                </div>

                {/* Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {goal.unit === '₹'
                      ? `₹${goal.current.toLocaleString()} / ₹${goal.target.toLocaleString()}`
                      : `${goal.current} / ${goal.target} ${goal.unit || ''}`
                    }
                  </span>
                  <span className="mono" style={{ fontWeight: 600, color: color, fontSize: '12px' }}>
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="progress-track" style={{ height: '6px' }}>
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Expired Goals ── */}
      {expiredGoals.length > 0 && (
        <section style={{ marginTop: '32px' }} id="expired-goals-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle size={16} style={{ color: 'var(--danger)' }} />
            <span className="section-label" style={{ marginBottom: 0, color: 'var(--danger)' }}>Expired Goals</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '12px' }}>
            {expiredGoals.map((goal, idx) => {
              const progress = Math.min((goal.current / goal.target) * 100, 100);
              return (
                <motion.div
                  key={goal.id}
                  className="glass-card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onGoalClick(goal)}
                  style={{
                    padding: '18px 20px',
                    cursor: 'pointer',
                    borderLeft: '3px solid var(--danger)',
                    opacity: 0.8,
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    {goal.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Expired: {goal.deadline}
                  </div>
                  <div className="progress-track" style={{ height: '6px' }}>
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8 }}
                      style={{ background: 'var(--danger)' }}
                    />
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                    {goal.unit === '₹'
                      ? `₹${goal.current.toLocaleString()} / ₹${goal.target.toLocaleString()}`
                      : `${goal.current} / ${goal.target} ${goal.unit || ''}`
                    } — Click for insight
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
