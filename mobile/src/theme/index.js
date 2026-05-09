// Color palette and design tokens for the entire app
export const colors = {
  background: '#0A0A1A',
  surface: '#12122A',
  card: '#1A1B35',
  cardBorder: '#2A2B50',
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',
  primaryGlow: 'rgba(124, 58, 237, 0.25)',
  accent: '#06B6D4',
  accentLight: '#67E8F9',
  success: '#10B981',
  successBg: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.15)',
  error: '#EF4444',
  errorBg: 'rgba(239, 68, 68, 0.15)',
  pending: '#F59E0B',
  confirmed: '#10B981',
  completed: '#9CA3AF',
  textPrimary: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  white: '#FFFFFF',
  star: '#FBBF24',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

export const gradients = {
  primary: ['#7C3AED', '#5B21B6'],
  accent: ['#06B6D4', '#0891B2'],
  card: ['#1A1B35', '#12122A'],
  header: ['#1A1B35', '#0A0A1A'],
  slot: ['#252550', '#1A1B35'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400', color: colors.textSecondary, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, letterSpacing: 0.5 },
};
