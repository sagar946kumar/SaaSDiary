import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Edit3, Check, X } from 'lucide-react';
import { formatLargeCurrency } from '../utils/calculations.js';
import { REVENUE_MILESTONES } from '../data/data.js';

export default function Revenue({ currentRevenue, onUpdateRevenue }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentRevenue.toString());

  const milestones = REVENUE_MILESTONES;

  // Find current milestone
  const currentMilestoneIdx = milestones.findIndex((m) => currentRevenue < m.amount);
  const nextMilestone = currentMilestoneIdx >= 0 ? milestones[currentMilestoneIdx] : milestones[milestones.length - 1];
  const prevMilestone = currentMilestoneIdx > 0 ? milestones[currentMilestoneIdx - 1] : { amount: 0 };

  const progressToNext = nextMilestone
    ? Math.min(((currentRevenue - prevMilestone.amount) / (nextMilestone.amount - prevMilestone.amount)) * 100, 100)
    : 100;

  const handleSave = () => {
    const num = parseFloat(editValue);
    if (!isNaN(num) && num >= 0) onUpdateRevenue(num);
    setEditing(false);
  };

  return (
    <section style={{ marginTop: '32px' }} id="revenue-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <IndianRupee size={16} style={{ color: '#f59e0b' }} />
        <span className="section-label" style={{ marginBottom: 0 }}>Revenue Tracker</span>
      </div>

      <div className="glass-card" style={{ padding: '24px' }}>
        {/* Current Revenue */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '4px' }}>
              Current Revenue
            </div>
            {editing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>₹</span>
                <input
                  type="number"
                  className="custom-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  style={{ width: '160px', fontSize: '18px', fontWeight: 700 }}
                  autoFocus
                  id="revenue-input"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSave}
                  style={{ background: 'var(--success)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                  <Check size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setEditing(false)}
                  style={{ background: 'var(--danger)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}
                >
                  <X size={14} />
                </motion.button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="mono" style={{ fontSize: '28px', fontWeight: 800, color: '#f59e0b' }}>
                  {formatLargeCurrency(currentRevenue)}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setEditValue(currentRevenue.toString()); setEditing(true); }}
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', cursor: 'pointer' }}
                  id="edit-revenue-btn"
                >
                  <Edit3 size={12} />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Progress to next milestone */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>
              Next milestone: <strong style={{ color: '#f59e0b' }}>{nextMilestone.label}</strong>
              {nextMilestone.deadline && <span style={{ color: 'var(--text-muted)' }}> (by {nextMilestone.deadline})</span>}
            </span>
            <span className="mono" style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
              {progressToNext.toFixed(1)}%
            </span>
          </div>
          <div className="progress-track">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressToNext}%` }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: 'linear-gradient(90deg, #f59e0b, #ef4444)' }}
            />
          </div>
        </div>

        {/* Milestone Timeline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', paddingTop: '8px' }}>
          {milestones.map((m, idx) => {
            const isReached = currentRevenue >= m.amount;
            const isCurrent = idx === currentMilestoneIdx;

            return (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 0 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 'none' }}
                >
                  <div style={{
                    width: isCurrent ? 16 : 12,
                    height: isCurrent ? 16 : 12,
                    borderRadius: '50%',
                    background: isReached ? '#22c55e' : isCurrent ? '#f59e0b' : 'var(--border-color)',
                    boxShadow: isCurrent ? '0 0 10px #f59e0b80' : undefined,
                    transition: 'all 0.3s',
                  }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: isReached ? '#22c55e' : isCurrent ? '#f59e0b' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {m.label}
                    </div>
                    {m.deadline && (
                      <div style={{ fontSize: '9px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {m.deadline}
                      </div>
                    )}
                  </div>
                </motion.div>
                {idx < milestones.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: 2,
                    background: isReached ? '#22c55e' : 'var(--border-color)',
                    margin: '0 4px',
                    marginBottom: '24px',
                    transition: 'background 0.3s',
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
