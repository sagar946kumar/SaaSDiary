import { motion } from 'framer-motion';
import { ArrowRight, Lock } from 'lucide-react';

export default function LandingPage({ onLogin, darkMode, onToggleDarkMode }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: darkMode ? '#0B0B0F' : '#F8F9FB',
        color: darkMode ? '#ffffff' : '#1e293b',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'background-color 0.4s ease, color 0.4s ease',
      }}
    >
      {/* Faint Heatmap Grid in Background */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(24, 18px)',
          gap: '6px',
          opacity: darkMode ? 0.03 : 0.06,
          pointerEvents: 'none',
          zIndex: 0,
          maskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 80%)',
        }}
      >
        {Array.from({ length: 240 }).map((_, i) => {
          // Color some cells to mimic a real heatmap
          let cellColor = darkMode ? '#1c1c28' : '#e2e4ed';
          if (i % 13 === 0) cellColor = 'var(--accent-primary)';
          else if (i % 19 === 0) cellColor = darkMode ? '#3b1f2b' : '#f9c5c5';
          else if (i % 29 === 0) cellColor = darkMode ? '#5c2434' : '#f08080';

          return (
            <div
              key={i}
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '4px',
                background: cellColor,
                transition: 'background-color 0.4s ease',
              }}
            />
          );
        })}
      </div>

      {/* Decorative Glow Blob */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          zIndex: 0,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Navigation Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          background: darkMode ? 'rgba(11, 11, 15, 0.6)' : 'rgba(248, 249, 251, 0.6)',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 10,
          transition: 'background-color 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div
          className="dashboard-container"
          style={{
            height: '70px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo.png" alt="SaaS Diary Logo" style={{ height: '32px', width: '32px' }} />
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: darkMode ? '#ffffff' : '#0f172a',
              }}
            >
              SaaS Diary
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleDarkMode}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid var(--border-color)',
                background: darkMode ? '#16161f' : '#ffffff',
                color: darkMode ? '#8888a0' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.4s ease, border-color 0.4s ease',
              }}
              title="Toggle theme"
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogin}
              style={{
                background: 'var(--gradient-1)',
                border: 'none',
                color: 'white',
                padding: '8px 18px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px var(--accent-glow)',
              }}
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main
        className="dashboard-container"
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto', padding: '40px 0' }}
        >
          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(24px, 7vw, 64px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              marginBottom: '20px',
              color: darkMode ? '#ffffff' : '#0f172a',
              whiteSpace: 'nowrap',
            }}
          >
            Idea → Building → Shipped
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 19px)',
              color: darkMode ? '#8888a0' : '#64748b',
              lineHeight: 1.5,
              marginBottom: '40px',
              maxWidth: '540px',
              marginRight: 'auto',
              marginLeft: 'auto',
              fontWeight: 450,
            }}
          >
            Start with an idea, build it step by step, and ship it to the world.
          </p>

          {/* CTA Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 35px var(--accent-glow)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onLogin}
              style={{
                background: 'var(--gradient-1)',
                color: 'white',
                border: 'none',
                padding: '16px 36px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <span>Get Started Free with Google</span>
              <ArrowRight size={18} />
            </motion.button>

            {/* Trust Text */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: darkMode ? '#8888a0' : '#475569',
                fontWeight: 700,
              }}
            >
              <Lock size={13} strokeWidth={2.5} />
              <span>Secure Firestore database</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '30px 0',
          fontSize: '12px',
          color: darkMode ? '#44445c' : '#475569',
          fontWeight: 700,
          textAlign: 'center',
          transition: 'border-color 0.4s ease, color 0.4s ease',
        }}
      >
        <p>© 2026 SaaS Diary. All rights reserved.</p>
      </footer>
    </div>
  );
}
