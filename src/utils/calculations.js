import {
  differenceInDays,
  differenceInMonths,
  format,
  addDays,
  endOfWeek,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
} from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_STATE } from '../data/data.js';

// ─── Constants ───────────────────────────────────────────────────────────────

export const START_DATE = new Date(2026, 1, 10); // Feb 10, 2026
export const END_DATE = new Date(2030, 11, 31);  // Dec 31, 2030
export const TODAY = new Date();

const STORAGE_KEY = 'sagar-saas-builder-state';

// ─── Progress calculations ──────────────────────────────────────────────────

export function getOverallTimelinePercent(endDateStr) {
  const endDate = endDateStr ? new Date(endDateStr) : END_DATE;
  const totalDays = differenceInDays(endDate, START_DATE) + 1;
  const elapsedDays = Math.max(0, differenceInDays(TODAY, START_DATE) + 1);
  return Math.min((elapsedDays / totalDays) * 100, 100);
}

export function getProgressData(mode, endDateStr) {
  const endDate = endDateStr ? new Date(endDateStr) : END_DATE;
  const totalDays = differenceInDays(endDate, START_DATE) + 1;
  const elapsedDays = Math.max(0, differenceInDays(TODAY, START_DATE) + 1);

  switch (mode) {
    case 'days':
      return { elapsed: Math.min(elapsedDays, totalDays), total: totalDays };
    case 'weeks': {
      const totalWeeks = eachWeekOfInterval({ start: START_DATE, end: endDate }, { weekStartsOn: 1 }).length;
      const elapsedWeeks = Math.min(Math.floor(elapsedDays / 7), totalWeeks);
      return { elapsed: elapsedWeeks, total: totalWeeks };
    }
    case 'months': {
      const totalMonths = differenceInMonths(endDate, START_DATE) + 1;
      const elapsedMonths = Math.min(differenceInMonths(TODAY, START_DATE) + 1, totalMonths);
      return { elapsed: elapsedMonths, total: totalMonths };
    }
    default:
      return { elapsed: 0, total: 1 };
  }
}

// ─── Heatmap data ───────────────────────────────────────────────────────────

export function getHeatmapData(mode, endDateStr) {
  const startDate = START_DATE;
  const endDate = endDateStr ? new Date(endDateStr) : END_DATE;

  switch (mode) {
    case 'days': {
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      return days.map((d) => {
        const dateStr = format(d, 'yyyy-MM-dd');
        const isSpent = d <= TODAY;
        return {
          date: dateStr,
          displayDate: format(d, 'MMM d, yyyy'),
          active: isSpent,
          day: d.getDay(),
        };
      });
    }
    case 'weeks': {
      const weeks = eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 }
      );
      return weeks.map((w) => {
        const wEnd = endOfWeek(w, { weekStartsOn: 1 });
        const isSpent = w <= TODAY;
        return {
          date: format(w, 'yyyy-MM-dd'),
          displayDate: `${format(w, 'MMM d')} – ${format(wEnd, 'MMM d, yyyy')}`,
          active: isSpent,
          day: 0,
        };
      });
    }
    case 'months': {
      const months = eachMonthOfInterval({ start: startDate, end: endDate });
      return months.map((m) => {
        const isSpent = m <= TODAY || format(m, 'yyyy-MM') === format(TODAY, 'yyyy-MM');
        return {
          date: format(m, 'yyyy-MM-dd'),
          displayDate: format(m, 'MMMM yyyy'),
          active: isSpent,
          day: 0,
        };
      });
    }
    default:
      return [];
  }
}

// ─── Currency formatting ────────────────────────────────────────────────────

export function formatCurrency(amount) {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 1)} Cr`;
  }
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
}

export function formatLargeCurrency(amount) {
  if (amount >= 1000000000000) return `₹${(amount / 10000000).toLocaleString()} Cr`;
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return cr >= 1000 ? `₹${cr.toLocaleString()} Cr` : `₹${cr} Cr`;
  }
  if (amount >= 100000) return `₹${amount / 100000} Lakh`;
  return `₹${amount.toLocaleString()}`;
}

// ─── Insight generation ─────────────────────────────────────────────────────

export function generateInsights(startups, goals, currentRevenue) {
  const insights = [];
  const completed = startups.filter((s) => s.status === 'completed').length;
  const building = startups.filter((s) => s.status === 'building').length;
  const total = startups.length;

  const daysSinceStart = differenceInDays(TODAY, START_DATE);
  const totalDays = differenceInDays(END_DATE, START_DATE);
  const pct = ((daysSinceStart / totalDays) * 100).toFixed(1);

  insights.push(`📊 You are ${pct}% through your SaaS journey timeline`);

  if (completed > 0) {
    insights.push(
      `🚀 ${completed} startup${completed > 1 ? 's' : ''} shipped, ${building} in progress, ${total - completed - building} in ideation`
    );
  }

  const monthsElapsed = differenceInMonths(TODAY, START_DATE) || 1;
  const rate = completed / monthsElapsed;
  insights.push(
    `📈 Current shipping rate: ${rate.toFixed(1)} startups/month (target: 4/month)`
  );

  if (rate < 4) {
    insights.push(
      `⚡ You need to ship ${Math.ceil(4 - rate)} more startups this month to stay on track`
    );
  }

  if (currentRevenue > 0) {
    insights.push(`💰 Current revenue: ${formatCurrency(currentRevenue)}`);
  }

  for (const goal of goals) {
    const progress = (goal.current / goal.target) * 100;
    if (progress < 25) {
      insights.push(`🎯 "${goal.title}" is at ${progress.toFixed(1)}% — needs attention`);
    }
  }

  return insights;
}

// ─── State persistence ──────────────────────────────────────────────────────

export function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && Array.isArray(parsed.goals)) {
        parsed.goals = parsed.goals.map((g) => {
          if (g.title === 'Make ₹25,000 Crore by 2029') {
            return { ...g, title: 'Make ₹25,000 Crore by 2030', deadline: '2030-12-31' };
          }
          return g;
        });
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return DEFAULT_STATE;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// ─── State mutations (all pure — return new state) ──────────────────────────

export function addStartup(state, name) {
  const newStartup = {
    id: uuidv4(),
    name,
    status: 'idea',
    ideaDate: new Date().toISOString().split('T')[0],
  };
  return { ...state, startups: [...state.startups, newStartup] };
}

export function moveStartup(state, id, newStatus) {
  const now = new Date().toISOString().split('T')[0];
  return {
    ...state,
    startups: state.startups.map((s) => {
      if (s.id !== id) return s;
      const updated = { ...s, status: newStatus };
      if (newStatus === 'building' && !s.buildStartDate) updated.buildStartDate = now;
      if (newStatus === 'completed' && !s.completedDate) {
        updated.completedDate = now;
        if (!updated.buildStartDate) updated.buildStartDate = now;
      }
      return updated;
    }),
  };
}

export function addGoal(state, goal) {
  return { ...state, goals: [...state.goals, { ...goal, id: uuidv4() }] };
}

export function addNote(state, note) {
  const idx = state.notes.findIndex((n) => n.date === note.date);
  if (idx >= 0) {
    const updated = [...state.notes];
    updated[idx] = { ...updated[idx], ...note };
    return { ...state, notes: updated };
  }
  return { ...state, notes: [...state.notes, { ...note, id: uuidv4() }] };
}

export function deleteNote(state, noteId) {
  return { ...state, notes: state.notes.filter((n) => n.id !== noteId) };
}

export function checkExpiredGoals(state) {
  const today = new Date().toISOString().split('T')[0];
  const expired = [];
  const active = [];

  for (const goal of state.goals) {
    if (goal.deadline < today && goal.current < goal.target) {
      expired.push(goal);
    } else {
      active.push(goal);
    }
  }

  if (expired.length === 0) return state;
  return {
    ...state,
    goals: active,
    expiredGoals: [...state.expiredGoals, ...expired],
  };
}
