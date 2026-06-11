import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Plus, ArrowRight, Lightbulb, Hammer, CheckCircle2, X } from 'lucide-react';

const stages = [
  { key: 'idea', label: 'Idea', icon: <Lightbulb size={14} />, color: '#818cf8', bgColor: '#6366f115' },
  { key: 'building', label: 'Building', icon: <Hammer size={14} />, color: '#f59e0b', bgColor: '#f59e0b15' },
  { key: 'completed', label: 'Completed', icon: <CheckCircle2 size={14} />, color: '#22c55e', bgColor: '#22c55e15' },
];

export default function Startups({ startups, onAddStartup, onMoveStartup }) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');

  const handleDragStart = useCallback((e, id) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  }, []);

  const handleDragOver = useCallback((e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverStage(null);
  }, []);

  const handleDrop = useCallback((e, stage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) onMoveStartup(id, stage);
    setDraggedId(null);
    setDragOverStage(null);
  }, [onMoveStartup]);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverStage(null);
  }, []);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAddStartup(newName.trim());
    setNewName('');
    setModalOpen(false);
  };

  return (
    <>
      <section style={{ marginTop: '32px' }} id="startup-section">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={16} style={{ color: 'var(--accent-primary)' }} />
            <span className="section-label" style={{ marginBottom: 0 }}>Startup Pipeline</span>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: '6px' }}>
              {startups.length} total
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-btn"
            onClick={() => setModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '13px' }}
            id="add-startup-btn"
          >
            <Plus size={14} />
            Add Startup
          </motion.button>
        </div>

        {/* Pipeline Flow Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          {stages.map((stage, idx) => (
            <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: stage.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                {stage.icon} {stage.label}
              </span>
              {idx < stages.length - 1 && (
                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>
          ))}
        </div>

        {/* Pipeline Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {stages.map((stage) => {
            const stageStartups = startups.filter((s) => s.status === stage.key);
            const isDragOver = dragOverStage === stage.key;

            return (
              <div
                key={stage.key}
                className={`glass-card pipeline-column ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, stage.key)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.key)}
                style={{
                  borderColor: isDragOver ? stage.color : undefined,
                  background: isDragOver ? `${stage.color}08` : undefined,
                }}
              >
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', padding: '0 4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: stage.color }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>{stage.label}</span>
                  </div>
                  <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)', background: stage.bgColor, padding: '2px 8px', borderRadius: '6px' }}>
                    {stageStartups.length}
                  </span>
                </div>

                {/* Startup Cards */}
                <AnimatePresence mode="popLayout">
                  {stageStartups.map((startup) => (
                    <motion.div
                      key={startup.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: draggedId === startup.id ? 0.4 : 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, startup.id)}
                      onDragEnd={handleDragEnd}
                      className="drag-item"
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        marginBottom: '8px',
                        borderLeft: `3px solid ${stage.color}`,
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px' }}>{startup.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {startup.ideaDate && <span>Idea: {startup.ideaDate}</span>}
                        {startup.buildStartDate && <span> · Build: {startup.buildStartDate}</span>}
                        {startup.completedDate && <span> · Done: {startup.completedDate}</span>}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {stageStartups.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px', borderRadius: 8, border: '1px dashed var(--border-color)' }}>
                    Drop startup here
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Add Startup Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700 }}>New Startup</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </motion.button>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Startup Name</label>
                <input
                  className="custom-input"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  placeholder="e.g., QuickPoll, DevMetrics…"
                  autoFocus
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glow-btn"
                onClick={handleAdd}
                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
              >
                Add to Pipeline
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
