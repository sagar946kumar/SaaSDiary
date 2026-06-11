import { motion } from 'framer-motion';
import { Rocket, Sun, Moon, User } from 'lucide-react';

export default function Header({ darkMode, onToggleDarkMode, endDate, onEditEndDate }) {
  const formattedEndDate = (() => {
    try {
      const parts = endDate.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const year = parts[0];
      return `${day} ${months[monthIdx]} ${year}`;
    } catch (e) {
      return '31 Dec 2030';
    }
  })();

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: darkMode
          ? 'rgba(10, 10, 15, 0.85)'
          : 'rgba(248, 249, 252, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="dashboard-container" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Left: Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'var(--gradient-1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px var(--accent-glow)',
              }}
            >
              <Rocket size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                <span className="gradient-text">SaaS Diary</span>
              </h1>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.3px', marginTop: '4px' }}>
                <span>Started: <span style={{ color: 'var(--text-secondary)' }}>10 Feb 2026</span></span>
                <span 
                  onClick={onEditEndDate} 
                  style={{ 
                    cursor: 'pointer', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    color: 'var(--accent-secondary)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.2)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                    e.currentTarget.style.color = 'var(--accent-secondary)';
                  }}
                >
                  Committed till: {formattedEndDate} ✏️
                </span>
              </div>
            </div>
          </div>

          {/* Right: Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleDarkMode}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'var(--gradient-2)',
                border: 'none',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              }}
              aria-label="Profile settings"
              id="profile-btn"
            >
              <User size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
