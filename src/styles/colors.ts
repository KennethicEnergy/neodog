export const colors = {
  // Base colors
  background: '#f5f5f5',
  white: '#ffffff',
  black: '#171717',

  // Brand colors
  primary: '#0070f3',
  primaryDark: '#0059c1',
  blueActive: '#3b82f6',

  // Status colors
  success: '#28a745',
  successLight: '#34c759e5',
  danger: '#dc3545',
  dangerLight: '#ff3b30e5',
  warning: '#ffc107',
  warningLight: '#ff9500e5',
  info: '#17a2b8',

  // Neutral colors
  secondary: '#6c757d',
  light: '#f8f9fa',
  dark: '#343a40',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',

  // UI colors
  borderColor: '#dee2e6',
  borderLight: '#e0e0e0',
  borderLighter: '#f0f0f0',
  textMuted: '#696969',
  textLight: '#666666',
  textLighter: '#888888',

  // Chart colors
  chartPurple: '#b567ff',
  chartBlue: '#5293ff',
  chartGreen: '#34d870',
  chartOrange: '#ff9633',
  chartPink: '#ff2cb2'
} as const;

export type ColorKey = keyof typeof colors;
