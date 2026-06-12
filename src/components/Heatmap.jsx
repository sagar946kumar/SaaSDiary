import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Grid3X3 } from 'lucide-react';
import { getHeatmapData } from '../utils/calculations.js';

export default function Heatmap({ timeMode, notes, onCellClick, endDate, startDate }) {
  const [hoveredCell, setHoveredCell] = useState(null);

  const data = useMemo(() => getHeatmapData(timeMode, endDate, startDate), [timeMode, endDate, startDate]);

  const cellSize = timeMode === 'days' ? 10 : timeMode === 'weeks' ? 18 : 28;
  const gap = 3;

  const renderGenericGrid = () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: `${gap}px` }}>
      {data.map((cell, idx) => {
        const note = notes.find((n) => n.date === cell.date);
        return (
          <div key={cell.date} style={{ position: 'relative' }}>
            <motion.div
              whileHover={{ scale: 1.2, zIndex: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onCellClick(cell.date)}
              onMouseEnter={() => setHoveredCell(idx)}
              onMouseLeave={() => setHoveredCell(null)}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: timeMode === 'months' ? 6 : timeMode === 'weeks' ? 4 : 2,
                cursor: 'pointer',
                background: cell.active ? '#ef4444' : '#22c55e',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '8px',
                color: 'white',
                fontWeight: 600,
              }}
            >
              {timeMode === 'months' && cell.displayDate.slice(0, 3)}
            </motion.div>
            {hoveredCell === idx && (
              <div className="heatmap-tooltip" style={{ minWidth: '160px' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {cell.displayDate}
                </div>
                <div style={{ color: cell.active ? '#ef4444' : '#22c55e', fontWeight: 600, marginBottom: note ? '4px' : '0px' }}>
                  {cell.active ? '● Spent' : '● Remaining'}
                </div>
                {note && (
                  <div style={{ color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '4px', marginTop: '4px', fontSize: '11px', whiteSpace: 'normal', wordBreak: 'break-word', maxWidth: '220px' }}>
                    📝 {note.content.slice(0, 80)}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section style={{ marginTop: '24px' }} id="heatmap-section">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Grid3X3 size={16} style={{ color: 'var(--accent-primary)' }} />
        <span className="section-label" style={{ marginBottom: 0 }}>Timeline Progress Map</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          Click a cell to view/add daily notes
        </span>
      </div>

      <div className="glass-card" style={{ padding: '20px', position: 'relative' }}>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', fontSize: '11px', fontWeight: 500 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: '#ef4444' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Spent</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: '#22c55e' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Remaining / Left</span>
          </div>
        </div>

        {/* Grid */}
        {renderGenericGrid()}
      </div>
    </section>
  );
}
