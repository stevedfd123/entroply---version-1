export interface FlowNode {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end';
  gradient: string;
  borderColor: string;
  glowColor: string;
  iconName: string;
  title: string;
  subtitle: string;
  concept: string;
  approximateLocation?: { x: number; y: number };
  pillars?: Array<{
    id: string;
    label: string;
    subLabel: string;
    detail: string;
    icon: string;
    unmanagedRisk: string;
  }>;
  items: Array<{
    text: string;
    subtext?: string;
    status?: 'negative' | 'positive' | 'warning' | 'info';
  }>;
  statement?: string;
  badge?: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label: string;
  subLabel?: string;
  color: string;
  animated: boolean;
}

export const initialE3Nodes: FlowNode[] = [
  {
    id: "e1_entropy",
    label: "E1: ENTROPY",
    type: "process",
    gradient: "from-orange-600 via-red-500 to-red-600",
    borderColor: "border-red-400",
    glowColor: "rgba(239, 68, 68, 0.4)",
    iconName: "Flame",
    title: "E1: ENTROPY (The Natural Decline)",
    subtitle: "The Normal Business State (Unmanaged)",
    badge: "Inherently Urgent Decay",
    concept: "In an unmanaged business system, processes naturally break down, waste increases, and performance deteriorates. This is the natural drift toward disorder (Entropy).",
    approximateLocation: { x: 15, y: 50 },
    items: [
      { text: "Unclear Cause & Effect", subtext: "Teams guess root causes, resulting in cyclic firefighting.", status: "negative" },
      { text: "Variability & Uncertainty", subtext: "Highly unpredictable output quality, lead times, and capacity.", status: "negative" },
      { text: "Inconsistency & Noise", subtext: "Conflicting data, unstandardized methods, and noise overlap signals.", status: "negative" },
      { text: "Fuzzy Decisions", subtext: "Choices are made based on gut feelings or loudest voices.", status: "negative" },
      { text: "Processes break down & Costs rise", subtext: "Waste accumulates and eats into profit margins.", status: "negative" },
      { text: "Discipline Declines", subtext: "Ad-hoc procedures replace standards, speeding up deterioration.", status: "warning" }
    ],
    statement: "⚠️ IF UNMANAGED: Entropy Drift accelerates exponentially, dragging performance down."
  },
  {
    id: "e2_lean_energy",
    label: "E2: LEAN ENERGY",
    type: "process",
    gradient: "from-emerald-600 via-teal-500 to-emerald-500",
    borderColor: "border-emerald-400",
    glowColor: "rgba(16, 185, 129, 0.4)",
    iconName: "Zap",
    title: "E2: LEAN ENERGY (The Anti-Entropy Force)",
    subtitle: "Structured Energy Applied to Business Systems",
    badge: "Anti-Entropy Shield",
    concept: "Lean Energy acts as the deliberate counter-force to natural decay. To restore order and achieve excellence, targeted structured energy must be continuously injected using Focus, Alignment, and Sustainability.",
    approximateLocation: { x: 50, y: 50 },
    pillars: [
      {
        id: "discipline",
        label: "1. Discipline",
        subLabel: "5S & DMS",
        detail: "Sustaining highly organized test-and-learn locations through 5S and Daily Management Systems (DMS).",
        icon: "CheckSquare",
        unmanagedRisk: "Workspace clutter, short-lived improvements, and creeping sloppiness."
      },
      {
        id: "visibility",
        label: "2. Visibility",
        subLabel: "Visual Management",
        detail: "Real-time visual dashboards, color-coded statuses, and obvious signals that immediately highlight abnormalities.",
        icon: "Eye",
        unmanagedRisk: "Hidden problems, delayed interventions, and progress blindspots."
      },
      {
        id: "structure",
        label: "3. Structure",
        subLabel: "Standard Work",
        detail: "Establishing clear baseline standards, visual checklists, and process pacing so everyone executes optimally.",
        icon: "Layers",
        unmanagedRisk: "Ad-hoc workflows, tribal knowledge gaps, and chaotic training."
      },
      {
        id: "flow",
        label: "4. Flow",
        subLabel: "VSM & SMED",
        detail: "Mapping value streams (VSM) and expediting changeovers (SMED) to eliminate handoff delays and queue build-ups.",
        icon: "Activity",
        unmanagedRisk: "Bottlenecks, high inventory, long lead times, and idle resources."
      },
      {
        id: "intelligence",
        label: "5. Intelligence",
        subLabel: "Data & Six Sigma",
        detail: "Leveraging diagnostic data and Six Sigma controls to target the absolute root cause of variability.",
        icon: "Cpu",
        unmanagedRisk: "Blind assumptions, superficial fixes, and repeated quality defects."
      }
    ],
    items: [
      { text: "FOCUS", subtext: "Isolate the critical waste sources; ignore distracting noise.", status: "positive" },
      { text: "ALIGN", subtext: "Synchronize departmental goals with actual customer value streams.", status: "positive" },
      { text: "SUSTAIN", subtext: "Institutionalize audits, reviews, and continuous improvement loops.", status: "positive" }
    ],
    statement: "⚡ THE FORMULA: Active Lean Energy counteracts natural entropy to shift systems into stable order."
  },
  {
    id: "e3_excellence",
    label: "E3: EXCELLENCE",
    type: "end",
    gradient: "from-amber-500 via-yellow-400 to-amber-600",
    borderColor: "border-yellow-400",
    glowColor: "rgba(245, 158, 11, 0.4)",
    iconName: "Award",
    title: "E3: EXCELLENCE (The Desired Outcome)",
    subtitle: "High-Performing Steady State",
    badge: "By-Design Success",
    concept: "The ultimate designed state. Here, operations become bulletproof, employees are empowered, and profit follows predictable efficiency templates.",
    approximateLocation: { x: 85, y: 50 },
    items: [
      { text: "Stable and Predictable Operations", subtext: "Processes flow like clockwork with negligible variation.", status: "positive" },
      { text: "Lower Overall Operating Costs", subtext: "Waste-free process pathways maximize financial yield.", status: "positive" },
      { text: "Significantly Higher Productivity", subtext: "Optimized team capacity achieves more with less frustration.", status: "positive" },
      { text: "Highly Engaged & Empowered People", subtext: "Workforce feels trusted, owning continuous improvement loops.", status: "positive" },
      { text: "Sustainable, Profitable Growth", subtext: "Scale operations seamlessly without quality compromise.", status: "positive" }
    ],
    statement: "🏆 EXCELLENCE IS NOT ACCIDENTAL: It is engineered."
  }
];

export const initialE3Edges: FlowEdge[] = [
  {
    from: "e1_entropy",
    to: "e2_lean_energy",
    label: "Continuous Injection of Lean Energy",
    subLabel: "Mitigates decline and structures chaos",
    color: "from-orange-500 to-emerald-500",
    animated: true
  },
  {
    from: "e2_lean_energy",
    to: "e3_excellence",
    label: "Engineers Desired Steady Outcomes",
    subLabel: "Solidifies high-efficiency metrics",
    color: "from-emerald-500 to-yellow-500",
    animated: true
  }
];
