// ==============================
// 1️⃣ DATA SEMANTIC COLORS
// ==============================
export const AWARENESS_COLORS = {
  low: '#ef4444',
  moderate: '#facc15',
  high: '#22c55e'
};

// Helper (used everywhere)
export const getAwarenessColor = (level) => {
  switch (level?.toLowerCase()) {
    case 'low':
    case 'low awareness':
    case 'no':
      return AWARENESS_COLORS.low;
    case 'moderate':
    case 'medium':
    case 'moderate awareness':
    case 'maybe':
      return AWARENESS_COLORS.moderate;
    case 'high':
    case 'high awareness':
    case 'yes':
      return AWARENESS_COLORS.high;
    default:
      return AWARENESS_COLORS.moderate;
  }
};

// ==============================
// 2️⃣ CHART SYSTEM COLORS
// ==============================
export const CHART_COLORS = {
  primary: '#0f766e',
  neutral: '#14b8a6',
  grid: '#e2e8f0',
  axis: '#334155',
  tooltipBg: '#ffffff',
  tooltipBorder: '#e2e8f0',
  inactiveOpacity: 0.25
};

// ==============================
// 3️⃣ LAYOUT / UI COLORS
// ==============================
export const LAYOUT_COLORS = {
  navbar: '#0b2f2b',
  pageBackground: '#f8fafc',
  cardBackground: '#ffffff',
  sectionAccent: '#14b8a6',

  textPrimary: '#0f172a',
  textOnDark: '#FFFFFF',
  textMuted: '#64748b',

  border: '#e2e8f0',
  shadow: 'rgba(11, 47, 43, 0.08)'
};

// ==============================
// 4️⃣ COMMON STYLES (OPTIONAL)
// ==============================
export const CHART_STYLES = {
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 12
};

