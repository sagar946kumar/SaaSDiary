import { motion } from 'framer-motion';
import { Rocket, Shield, Activity, Target, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function LandingPage({ onLogin, darkMode, onToggleDarkMode }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Blur Blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          zIndex: 0,
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
          zIndex: 0,
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {/* Navigation Header */}
      <header
        style={{
          borderBottom: '1px solid var(--border-color)',
          background: 'rgba(10, 10, 15, 0.4)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
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
            <span style={{ fontSize: '18px', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
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
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="glow-btn"
              onClick={onLogin}
              style={{
                fontSize: '13px',
                padding: '8px 18px',
              }}
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="dashboard-container" style={{ position: 'relative', zIndex: 1, paddingTop: '80px', paddingBottom: '80px' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'var(--accent-glow)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-secondary)',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '28px',
            }}
          >
            <Rocket size={14} />
            <span>Developer-First Indie Hacker Diary</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              marginBottom: '20px',
            }}
          >
            Your SaaS Shipping Velocity,{' '}
            <span className="gradient-text" style={{ background: 'var(--gradient-2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Visualized.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(15px, 2vw, 18px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '38px',
              maxWidth: '640px',
              marginRight: 'auto',
              marginLeft: 'auto',
            }}
          >
            Document your journey to $10k MRR. Track daily code logs, set milestones, view your shipping commitment heatmap, and manage your pipeline in one gorgeous page.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '60px',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px var(--accent-glow)' }}
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
                gap: '10px',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <span>Get Started Free with Google</span>
              <ArrowRight size={18} />
            </motion.button>

            <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} style={{ color: 'var(--success)' }} /> No credit card required
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lock size={14} /> Secure Firestore database
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginTop: '40px',
          }}
        >
          {/* Card 1 */}
          <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                marginBottom: '20px',
              }}
            >
              <Activity size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Commitment Heatmap</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              A GitHub-style contribution chart mapping every single day of your journey. Watch your shipping activity build consistency.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#06b6d4',
                marginBottom: '20px',
              }}
            >
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Resolution Goals</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Set custom ship targets, deadlined goals, or revenue metrics. Calculate percentage completion rates instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
                marginBottom: '20px',
              }}
            >
              <Shield size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Real-time Google Sync</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              No more losing data when you clear your cache. Log in securely with Google and keep your diary synced across your devices.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '40px 0',
          marginTop: '80px',
          fontSize: '13px',
          color: 'var(--text-muted)',
          textAlign: 'center',
        }}
      >
        <p>© 2026 SaaS Diary. All rights reserved. Build and ship consistently.</p>
      </footer>
    </div>
  );
}
