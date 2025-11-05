export const theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    tertiary: '#f093fb',
    accent: '#a78bfa',
    background: {
      dark: '#0f0c29',
      medium: '#302b63',
      light: '#24243e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#e5e7eb',
      muted: '#9ca3af',
    },
    userMessage: ['#667eea', '#764ba2'],
    aiMessage: 'rgba(255, 255, 255, 0.1)',
    inputBackground: 'rgba(255, 255, 255, 0.08)',
  },
  gradients: {
    primary: ['#667eea', '#764ba2', '#f093fb'] as readonly [string, string, ...string[]],
    background: ['#0f0c29', '#302b63', '#24243e'] as readonly [string, string, ...string[]],
    userBubble: ['#667eea', '#764ba2'] as readonly [string, string, ...string[]],
    button: ['#667eea', '#a78bfa'] as readonly [string, string, ...string[]],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16,
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;

