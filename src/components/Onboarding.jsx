import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Onboarding({ user, onComplete, darkMode }) {
  const todayStr = new Date().toISOString().split('T')[0];
  const fiveYearsFromNow = new Date();
  fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
  const defaultEndDateStr = fiveYearsFromNow.toISOString().split('T')[0];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    startDate: todayStr,
    endDate: defaultEndDateStr,
    goalType: '', // start unselected
    startupTarget: '', // start unselected
    revenueTarget: '', // start unselected
    pace: '', // start unselected
  });

  const isNextDisabled = () => {
    if (step === 1) return !formData.name.trim();
    if (step === 2) return !formData.startDate;
    if (step === 3) return !formData.endDate;
    if (step === 4) return !formData.goalType;
    if (step === 5) {
      if (formData.goalType === 'startups') {
        return !formData.startupTarget || isNaN(parseInt(formData.startupTarget));
      }
      if (formData.goalType === 'revenue') {
        return !formData.revenueTarget || isNaN(parseInt(formData.revenueTarget));
      }
      if (formData.goalType === 'both') {
        return (
          !formData.startupTarget || isNaN(parseInt(formData.startupTarget)) ||
          !formData.revenueTarget || isNaN(parseInt(formData.revenueTarget))
        );
      }
    }
    if (step === 6) return !formData.pace;
    return false;
  };

  const [isCompletedScreen, setIsCompletedScreen] = useState(false);

  // Determine total steps based on goalType logic
  // (We'll show step 5 with either startup target, revenue target, or both)
  const totalSteps = 6;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      setIsCompletedScreen(true);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onComplete(formData);
  };

  // Inline styles depending on darkMode
  const bg = darkMode ? '#0B0B0F' : '#F8F9FB';
  const text = darkMode ? '#ffffff' : '#0f172a';
  const mutedText = darkMode ? '#8888a0' : '#64748b';
  const cardBg = darkMode ? '#16161f' : '#ffffff';
  const border = darkMode ? '#2a2a3a' : '#e2e4ed';

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bg,
        color: text,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        transition: 'background-color 0.4s ease, color 0.4s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow Blob */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
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

      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '40px',
          background: cardBg,
          borderColor: border,
          zIndex: 1,
          boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        {!isCompletedScreen ? (
          <div>
            {/* Step Counter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-primary)' }}>
                Onboarding Setup
              </span>
              <span style={{ fontSize: '13px', color: mutedText, fontWeight: 600 }}>
                Step {step} of {totalSteps}
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '4px', background: border, borderRadius: '2px', marginBottom: '40px', overflow: 'hidden' }}>
              <motion.div
                style={{ height: '100%', background: 'var(--gradient-1)' }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Steps Container */}
            <div style={{ minHeight: '180px', marginBottom: '40px' }}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                      What’s your name?
                    </h2>
                    <input
                      type="text"
                      className="custom-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      style={{ fontSize: '18px', padding: '14px 18px' }}
                      autoFocus
                    />
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                      When did you start your journey?
                    </h2>
                    <input
                      type="date"
                      className="custom-input"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      style={{ fontSize: '18px', padding: '14px 18px' }}
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                      Until when are you committed?
                    </h2>
                    <input
                      type="date"
                      className="custom-input"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      style={{ fontSize: '18px', padding: '14px 18px' }}
                    />
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                      What do you want to track?
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { id: 'startups', label: 'Startups Shipped' },
                        { id: 'revenue', label: 'Revenue Earned' },
                        { id: 'both', label: 'Both Startups and Revenue' },
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, goalType: opt.id })}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: `2px solid ${formData.goalType === opt.id ? 'var(--accent-primary)' : border}`,
                            background: formData.goalType === opt.id ? 'var(--accent-glow)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: 650,
                            fontSize: '15px',
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 5 && (
                  <motion.div key="step5" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    {formData.goalType === 'revenue' ? (
                      <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                          What is your revenue goal?
                        </h2>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '20px', fontWeight: 700, color: mutedText }}>
                            ₹
                          </span>
                          <input
                            type="number"
                            className="custom-input"
                            value={formData.revenueTarget}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFormData({ ...formData, revenueTarget: val === '' ? '' : Math.max(0, parseInt(val) || 0) });
                            }}
                            placeholder="e.g. 100000"
                            style={{ fontSize: '18px', padding: '14px 18px 14px 38px' }}
                            autoFocus
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                          How many startups do you want to ship?
                        </h2>
                        <input
                          type="number"
                          className="custom-input"
                          value={formData.startupTarget}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData({ ...formData, startupTarget: val === '' ? '' : Math.max(0, parseInt(val) || 0) });
                          }}
                          placeholder="e.g. 12"
                          style={{ fontSize: '18px', padding: '14px 18px' }}
                          autoFocus
                        />
                        {formData.goalType === 'both' && (
                          <div style={{ marginTop: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.5px' }}>
                              And what is your revenue goal?
                            </h2>
                            <div style={{ position: 'relative' }}>
                              <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', fontWeight: 700, color: mutedText }}>
                                ₹
                              </span>
                              <input
                                type="number"
                                className="custom-input"
                                value={formData.revenueTarget}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setFormData({ ...formData, revenueTarget: val === '' ? '' : Math.max(0, parseInt(val) || 0) });
                                }}
                                placeholder="e.g. 500000"
                                style={{ fontSize: '18px', padding: '14px 18px 14px 38px' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 6 && (
                  <motion.div key="step6" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                    <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
                      How often will you ship?
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { id: 'daily', label: 'Daily Shipments' },
                        { id: 'weekly', label: 'Weekly Velocity' },
                        { id: 'monthly', label: 'Monthly Launches' },
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, pace: opt.id })}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '12px',
                            border: `2px solid ${formData.pace === opt.id ? 'var(--accent-primary)' : border}`,
                            background: formData.pace === opt.id ? 'var(--accent-glow)' : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontWeight: 650,
                            fontSize: '15px',
                          }}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
              {step > 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrev}
                  style={{
                    background: 'transparent',
                    color: text,
                    border: `1px solid ${border}`,
                    padding: '14px 24px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </motion.button>
              ) : (
                <div />
              )}

              <motion.button
                whileHover={!isNextDisabled() ? { scale: 1.02, boxShadow: '0 0 20px var(--accent-glow)' } : {}}
                whileTap={!isNextDisabled() ? { scale: 0.98 } : {}}
                onClick={handleNext}
                disabled={isNextDisabled()}
                style={{
                  background: 'var(--gradient-1)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 28px',
                  borderRadius: '10px',
                  cursor: isNextDisabled() ? 'not-allowed' : 'pointer',
                  opacity: isNextDisabled() ? 0.6 : 1,
                  fontSize: '14px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginLeft: 'auto',
                }}
              >
                <span>{step === totalSteps ? 'Finish' : 'Next'}</span>
                <ArrowRight size={16} />
              </motion.button>
            </div>
          </div>
        ) : (
          /* Final Congratulations / Completion Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center', padding: '10px 0' }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
                margin: '0 auto 24px auto',
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.5px' }}>
              Day 1 of your journey starts now.
            </h2>

            <p style={{ color: mutedText, fontSize: '15px', lineHeight: 1.5, marginBottom: '36px' }}>
              We've dynamically customized your SaaS Diary dashboard. Let's make it happen.
            </p>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px var(--accent-glow)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              style={{
                background: 'var(--gradient-1)',
                color: 'white',
                border: 'none',
                width: '100%',
                padding: '16px 24px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>Enter Dashboard</span>
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
