import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  loadState,
  saveState,
  checkExpiredGoals,
  addStartup,
  moveStartup,
  addNote,
  deleteNote,
  addGoal,
  generateInsights,
  formatCurrency,
} from './utils/calculations.js';

import { auth, googleProvider, db } from './firebase.js';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

import Header from './components/Header.jsx';
import Progress from './components/Progress.jsx';
import Heatmap from './components/Heatmap.jsx';
import Startups from './components/Startups.jsx';
import Goals from './components/Goals.jsx';
import Notes from './components/Notes.jsx';

export default function App() {
  const [state, setState] = useState(() => {
    const loaded = loadState();
    return checkExpiredGoals(loaded);
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [insightGoal, setInsightGoal] = useState(null);
  const [isEditEndDateOpen, setIsEditEndDateOpen] = useState(false);
  const [tempEndDate, setTempEndDate] = useState(state.endDate || '2030-12-31');
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [goalForm, setGoalForm] = useState({
    title: '',
    target: 10,
    deadline: '2026-12-31',
    type: 'fixed',
    unit: 'startups',
  });
  const notesRef = useRef(null);

  const [isEditNetworthOpen, setIsEditNetworthOpen] = useState(false);
  const [tempNetworth, setTempNetworth] = useState(state.currentRevenue || 0);

  // 1. Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const docRef = doc(db, 'users', u.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setState(docSnap.data());
          } else {
            // First time login: seed cloud database with current local storage state
            await setDoc(docRef, state);
          }
        } catch (err) {
          console.error('Error loading Firestore data on login:', err);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore document sync (inbound changes)
  useEffect(() => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const remoteData = docSnap.data();
        setState((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(remoteData)) {
            return remoteData;
          }
          return prev;
        });
      }
    });
    return () => unsubscribe();
  }, [user]);

  // 3. Local/Cloud save triggers (outbound changes)
  useEffect(() => {
    saveState(state);
    if (user) {
      const saveToFirestore = async () => {
        try {
          await setDoc(doc(db, 'users', user.uid), state);
        } catch (err) {
          console.error('Error saving state to Firestore:', err);
        }
      };
      saveToFirestore();
    }
  }, [state, user]);

  const handleLogin = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Error signing in with Google:', err);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setState(loadState()); // fallback to local state
    } catch (err) {
      console.error('Error signing out:', err);
    }
  }, []);

  useEffect(() => {
    if (state.endDate) {
      setTempEndDate(state.endDate);
    }
  }, [state.endDate]);

  useEffect(() => {
    setTempNetworth(state.currentRevenue);
  }, [state.currentRevenue]);

  // ─── State update helpers ───────────────────────────────────────────────

  const update = useCallback((fn) => setState((prev) => fn(prev)), []);

  const handleTimeModeChange = useCallback(
    (mode) => update((s) => ({ ...s, timeMode: mode })),
    [update]
  );

  const handleToggleDarkMode = useCallback(
    () => update((s) => ({ ...s, darkMode: !s.darkMode })),
    [update]
  );

  const handleAddStartup = useCallback(
    (name) => update((s) => addStartup(s, name)),
    [update]
  );

  const handleMoveStartup = useCallback(
    (id, status) => update((s) => moveStartup(s, id, status)),
    [update]
  );

  const handleAddNote = useCallback(
    (note) => update((s) => addNote(s, note)),
    [update]
  );

  const handleDeleteNote = useCallback(
    (noteId) => update((s) => deleteNote(s, noteId)),
    [update]
  );

  const handleAddGoal = useCallback(
    (goal) => update((s) => addGoal(s, goal)),
    [update]
  );

  const handleUpdateRevenue = useCallback(
    (amount) => update((s) => ({ ...s, currentRevenue: amount })),
    [update]
  );

  const handleHeatmapClick = useCallback(
    (date) => {
      // Scroll to notes section for this date
      const el = document.getElementById('notes-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    },
    []
  );

  const handleGoalClick = useCallback((goal) => {
    setInsightGoal(goal);
  }, []);

  // ─── Goal Enrichment ───────────────────────────────────────────────────
  const completedStartupsCount = state.startups.filter((s) => s.status === 'completed').length;

  const enrichGoals = (goalsList) => {
    return goalsList.map((goal) => {
      if (goal.unit === '₹') {
        return { ...goal, current: state.currentRevenue };
      }
      if (goal.unit === 'startups') {
        return { ...goal, current: completedStartupsCount };
      }
      return goal;
    });
  };

  const enrichedGoals = enrichGoals(state.goals);
  const enrichedExpiredGoals = enrichGoals(state.expiredGoals);

  // ─── Insights ───────────────────────────────────────────────────────────

  const insights = generateInsights(state.startups, state.goals, state.currentRevenue);

  // ─── Animation variants ─────────────────────────────────────────────────

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  };

  return (
    <div
      data-theme={state.darkMode ? 'dark' : 'light'}
      style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Header
        darkMode={state.darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        endDate={state.endDate || '2030-12-31'}
        onEditEndDate={() => setIsEditEndDateOpen(true)}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="dashboard-container" style={{ paddingBottom: '60px' }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* 1. Journey Progress */}
          <motion.div variants={itemVariants}>
            <Progress
              timeMode={state.timeMode}
              onTimeModeChange={handleTimeModeChange}
              startups={state.startups}
              endDate={state.endDate || '2030-12-31'}
              currentRevenue={state.currentRevenue}
              onEditNetworth={() => setIsEditNetworthOpen(true)}
            />
          </motion.div>

          {/* 2. Heat Map */}
          <motion.div variants={itemVariants}>
            <Heatmap
              timeMode={state.timeMode}
              notes={state.notes}
              onCellClick={handleHeatmapClick}
              endDate={state.endDate || '2030-12-31'}
            />
          </motion.div>

          {/* 3. Goal and Resolution */}
          <motion.div variants={itemVariants}>
            <Goals
              goals={enrichedGoals}
              expiredGoals={enrichedExpiredGoals}
              onAddGoal={() => setIsAddGoalOpen(true)}
              onGoalClick={handleGoalClick}
            />
          </motion.div>

          {/* 4. Startups Pipeline */}
          <motion.div variants={itemVariants}>
            <Startups
              startups={state.startups}
              onAddStartup={handleAddStartup}
              onMoveStartup={handleMoveStartup}
            />
          </motion.div>

          {/* 5. Daily Notes */}
          <motion.div variants={itemVariants}>
            <Notes
              ref={notesRef}
              notes={state.notes}
              onAddNote={handleAddNote}
              onEditNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </motion.div>

        </motion.div>
      </main>

      {/* ── Insight Popup ── */}
      <AnimatePresence>
        {(() => {
          const activeInsightGoal = insightGoal
            ? (enrichedGoals.find((g) => g.id === insightGoal.id) || enrichedExpiredGoals.find((g) => g.id === insightGoal.id) || insightGoal)
            : null;

          if (!activeInsightGoal) return null;

          return (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInsightGoal(null)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '440px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 700 }}>📊 Goal Insight</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setInsightGoal(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>{activeInsightGoal.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {activeInsightGoal.unit === '₹' ? (
                      <>
                        <p>You've earned <strong style={{ color: '#f59e0b' }}>{formatCurrency(activeInsightGoal.current)}</strong> out of a target of <strong>{formatCurrency(activeInsightGoal.target)}</strong>.</p>
                        <p style={{ marginTop: '8px' }}>That's <strong style={{ color: 'var(--accent-primary)' }}>{((activeInsightGoal.current / activeInsightGoal.target) * 100).toFixed(2)}%</strong> of your goal{activeInsightGoal.deadline && ` by ${activeInsightGoal.deadline}`}.</p>
                      </>
                    ) : (
                      <>
                        <p>You completed <strong style={{ color: 'var(--success)' }}>{activeInsightGoal.current}</strong> out of <strong>{activeInsightGoal.target} {activeInsightGoal.unit}</strong>.</p>
                        <p style={{ marginTop: '8px' }}>Progress: <strong style={{ color: 'var(--accent-primary)' }}>{((activeInsightGoal.current / activeInsightGoal.target) * 100).toFixed(1)}%</strong>{activeInsightGoal.deadline && ` — deadline: ${activeInsightGoal.deadline}`}.</p>
                        {activeInsightGoal.current < activeInsightGoal.target && (
                          <p style={{ marginTop: '8px', color: 'var(--warning)' }}>
                            ⚡ You still need <strong>{activeInsightGoal.target - activeInsightGoal.current}</strong> more {activeInsightGoal.unit} to hit this goal.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="progress-track" style={{ height: '8px', marginTop: '12px' }}>
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((activeInsightGoal.current / activeInsightGoal.target) * 100, 100)}%` }}
                    transition={{ duration: 0.8 }}
                    style={{
                      background: activeInsightGoal.current >= activeInsightGoal.target
                        ? 'var(--success)'
                        : 'var(--gradient-1)',
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>
          );
        })()}

        {/* ── Edit Committed Date Modal ── */}
        {isEditEndDateOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditEndDateOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '400px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>📅 Edit Committed Date</h2>
                <button
                  onClick={() => setIsEditEndDateOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Committed till
                </label>
                <input
                  type="date"
                  className="custom-input"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  className="glow-btn"
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  onClick={() => setIsEditEndDateOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="glow-btn"
                  onClick={() => {
                    if (tempEndDate) {
                      update((s) => ({ ...s, endDate: tempEndDate }));
                      setIsEditEndDateOpen(false);
                    }
                  }}
                >
                  Save Date
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Add Goal Modal ── */}
        {isAddGoalOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddGoalOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '480px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>🎯 Add New Goal</h2>
                <button
                  onClick={() => setIsAddGoalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Goal Title
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="e.g. Complete 5 startups"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Target Value
                    </label>
                    <input
                      type="number"
                      className="custom-input"
                      value={goalForm.target}
                      onChange={(e) => setGoalForm({ ...goalForm, target: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Unit
                    </label>
                    <select
                      className="custom-select"
                      style={{ width: '100%', padding: '10px 36px 10px 14px' }}
                      value={goalForm.unit}
                      onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                    >
                      <option value="startups">startups</option>
                      <option value="days">days</option>
                      <option value="₹">₹ (INR)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Goal Type
                    </label>
                    <select
                      className="custom-select"
                      style={{ width: '100%', padding: '10px 36px 10px 14px' }}
                      value={goalForm.type}
                      onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value })}
                    >
                      <option value="fixed">Fixed Target</option>
                      <option value="monthly">Monthly Recurring</option>
                      <option value="longterm">Longterm Milestone</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Deadline
                    </label>
                    <input
                      type="date"
                      className="custom-input"
                      value={goalForm.deadline}
                      onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  className="glow-btn"
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  onClick={() => setIsAddGoalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="glow-btn"
                  onClick={() => {
                    if (goalForm.title.trim()) {
                      handleAddGoal({
                        title: goalForm.title,
                        target: goalForm.target,
                        current: 0,
                        deadline: goalForm.deadline,
                        type: goalForm.type,
                        unit: goalForm.unit,
                      });
                      setIsAddGoalOpen(false);
                      setGoalForm({ title: '', target: 10, deadline: '2026-12-31', type: 'fixed', unit: 'startups' });
                    }
                  }}
                >
                  Add Goal
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Edit Total Earning Modal ── */}
        {isEditNetworthOpen && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsEditNetworthOpen(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '400px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800 }}>💰 Edit Total Earning</h2>
                <button
                  onClick={() => setIsEditNetworthOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Current Earning (₹)
                </label>
                <input
                  type="number"
                  className="custom-input"
                  value={tempNetworth}
                  onChange={(e) => setTempNetworth(parseFloat(e.target.value) || 0)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  className="glow-btn"
                  style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                  onClick={() => setIsEditNetworthOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="glow-btn"
                  onClick={() => {
                    handleUpdateRevenue(tempNetworth);
                    setIsEditNetworthOpen(false);
                  }}
                >
                  Save Earning
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
