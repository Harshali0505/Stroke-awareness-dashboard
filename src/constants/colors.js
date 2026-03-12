// ==============================
// 1️⃣ DATA SEMANTIC COLORS
// ==============================
// Healthcare analytics palette — works in both light and dark mode
export const AWARENESS_COLORS = {
  low:      '#f87171', // Soft red     – low / alert
  moderate: '#fbbf24', // Amber        – moderate / caution
  high:     '#2dd4bf', // Teal         – high / positive
};

// Helper (used everywhere across chart components)
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
      return '#94a3b8'; // neutral grey for unknowns
  }
};

// ==============================
// 2️⃣ CHART SYSTEM COLORS
// ==============================
export const CHART_COLORS = {
  // Primary bar / data color
  primary:         '#0f766e',
  // Secondary / neutral bars (GenericBarChart single-series bars)
  neutral:         '#14b8a6',
  // Grid lines — very subtle
  grid:            'rgba(148,163,184,0.18)',
  // Axis text — adapts to mode via CSS but we keep a readable default
  axis:            '#64748b',
  // Tooltip styling
  tooltipBg:       '#ffffff',
  tooltipBorder:   'rgba(148,163,184,0.25)',
  // Dim inactive series
  inactiveOpacity: 0.2,
  // Trend/reference line
  high:            '#0d9488',

  // Multi-series palette  (used when you need an array, e.g. pie slices)
  palette: [
    '#14b8a6', // teal
    '#fbbf24', // amber
    '#f87171', // soft red
    '#818cf8', // indigo
    '#34d399', // emerald
    '#fb923c', // orange
    '#a78bfa', // violet
    '#38bdf8', // sky blue
  ],
};

// ==============================
// 3️⃣ LAYOUT / UI COLORS
// ==============================
export const LAYOUT_COLORS = {
  navbar:          '#0b2f2b',
  pageBackground:  '#f8fafc',
  cardBackground:  '#ffffff',
  sectionAccent:   '#14b8a6',

  textPrimary:     '#0f172a',
  textOnDark:      '#FFFFFF',
  textMuted:       '#64748b',

  border:          'rgba(148,163,184,0.2)',
  shadow:          '0 4px 20px rgba(11,47,43,0.10)',
};

// ==============================
// 4️⃣ COMMON STYLES
// ==============================
export const CHART_STYLES = {
  fontFamily:
    'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: 12,
};
