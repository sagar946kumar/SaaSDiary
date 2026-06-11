import { v4 as uuidv4 } from 'uuid';

// ─── Default seed data for first-time load ───────────────────────────────────

export const DEFAULT_STARTUPS = [
  {
    id: uuidv4(),
    name: 'DataLakeGuard',
    status: 'completed',
    ideaDate: '2026-02-15',
    buildStartDate: '2026-03-01',
    completedDate: '2026-03-20',
  },
  {
    id: uuidv4(),
    name: 'Momentum Tracker',
    status: 'completed',
    ideaDate: '2026-03-10',
    buildStartDate: '2026-03-25',
    completedDate: '2026-04-15',
  },
  {
    id: uuidv4(),
    name: 'InvoiceFlow',
    status: 'building',
    ideaDate: '2026-04-01',
    buildStartDate: '2026-04-20',
  },
  {
    id: uuidv4(),
    name: 'MailCraft AI',
    status: 'building',
    ideaDate: '2026-04-10',
    buildStartDate: '2026-05-01',
  },
  {
    id: uuidv4(),
    name: 'QuickPoll',
    status: 'idea',
    ideaDate: '2026-05-15',
  },
  {
    id: uuidv4(),
    name: 'DevMetrics',
    status: 'idea',
    ideaDate: '2026-05-20',
  },
  {
    id: uuidv4(),
    name: 'ContentPilot',
    status: 'idea',
    ideaDate: '2026-06-01',
  },
  {
    id: uuidv4(),
    name: 'SaaSKit UI',
    status: 'building',
    ideaDate: '2026-05-05',
    buildStartDate: '2026-05-25',
  },
  {
    id: uuidv4(),
    name: 'LeadGen Pro',
    status: 'idea',
    ideaDate: '2026-06-05',
  },
  {
    id: uuidv4(),
    name: 'FinTrack',
    status: 'idea',
    ideaDate: '2026-06-10',
  },
];

export const DEFAULT_GOALS = [
  {
    id: uuidv4(),
    title: 'Ship 4 startups every month',
    target: 4,
    current: 2,
    deadline: '2026-06-30',
    type: 'monthly',
    unit: 'startups',
  },
  {
    id: uuidv4(),
    title: 'Complete 100 startups in 2026',
    target: 100,
    current: 2,
    deadline: '2026-12-31',
    type: 'fixed',
    unit: 'startups',
  },
  {
    id: uuidv4(),
    title: 'Make ₹6 Crore in 2026',
    target: 60000000,
    current: 500,
    deadline: '2026-12-31',
    type: 'fixed',
    unit: '₹',
  },
  {
    id: uuidv4(),
    title: 'Make ₹25,000 Crore by 2030',
    target: 250000000000,
    current: 500,
    deadline: '2030-12-31',
    type: 'longterm',
    unit: '₹',
  },
];

export const DEFAULT_EXPIRED_GOALS = [
  {
    id: uuidv4(),
    title: '15+ startups by 2 May 2026',
    target: 15,
    current: 10,
    deadline: '2026-05-02',
    type: 'fixed',
    unit: 'startups',
  },
  {
    id: uuidv4(),
    title: 'Make ₹1 Cr by 2 May',
    target: 10000000,
    current: 500,
    deadline: '2026-05-02',
    type: 'fixed',
    unit: '₹',
  },
];

export const DEFAULT_NOTES = [
  {
    id: uuidv4(),
    date: '2026-06-11',
    content: 'Worked on SaaS Builder Dashboard. Designed wireframes and started implementation.',
    checklist: [
      { id: uuidv4(), text: 'Design wireframes', completed: true },
      { id: uuidv4(), text: 'Setup project scaffold', completed: true },
      { id: uuidv4(), text: 'Build dashboard UI', completed: false },
    ],
  },
  {
    id: uuidv4(),
    date: '2026-06-10',
    content: 'Brainstormed FinTrack startup idea. Worked on InvoiceFlow billing module.',
    checklist: [
      { id: uuidv4(), text: 'FinTrack ideation', completed: true },
      { id: uuidv4(), text: 'InvoiceFlow billing', completed: true },
    ],
  },
  {
    id: uuidv4(),
    date: '2026-06-09',
    content: 'Shipped Momentum Tracker bugfixes. Started SaaSKit UI components.',
    checklist: [],
  },
  {
    id: uuidv4(),
    date: '2026-06-08',
    content: 'Revenue call with potential client for InvoiceFlow. Updated landing page.',
    checklist: [
      { id: uuidv4(), text: 'Client call', completed: true },
      { id: uuidv4(), text: 'Landing page update', completed: true },
    ],
  },
  {
    id: uuidv4(),
    date: '2026-06-05',
    content: 'Ideated LeadGen Pro concept. Mapped out feature list.',
    checklist: [],
  },
  {
    id: uuidv4(),
    date: '2026-06-03',
    content: 'DataLakeGuard maintenance and documentation.',
    checklist: [],
  },
  {
    id: uuidv4(),
    date: '2026-06-01',
    content: 'ContentPilot idea born. Explored AI content generation APIs.',
    checklist: [],
  },
  {
    id: uuidv4(),
    date: '2026-05-28',
    content: 'MailCraft AI backend setup. Integrated email parsing.',
    checklist: [],
  },
  {
    id: uuidv4(),
    date: '2026-05-25',
    content: 'SaaSKit UI project kickoff. Setup component library.',
    checklist: [],
  },
];

export const REVENUE_MILESTONES = [
  { label: '₹500', amount: 500 },
  { label: '₹1 Crore', amount: 10000000, deadline: '2 May 2026' },
  { label: '₹6 Crore', amount: 60000000, deadline: '2026' },
  { label: '₹25,000 Crore', amount: 250000000000, deadline: '2029' },
];

// ─── Default full state ──────────────────────────────────────────────────────

export const DEFAULT_STATE = {
  timeMode: 'days',
  darkMode: true,
  currentRevenue: 500,
  startups: DEFAULT_STARTUPS,
  goals: DEFAULT_GOALS,
  expiredGoals: DEFAULT_EXPIRED_GOALS,
  notes: DEFAULT_NOTES,
  endDate: '2030-12-31',
};
