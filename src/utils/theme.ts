export const theme = {
  colors: {
    background: '#0a0a0a',
    surface: '#1a1a1a',
    primary: '#d4af37',
    secondary: '#8b4789',
    text: '#f5f5dc',
    textSecondary: '#c0c0c0',
    border: '#3a3a3a',
    accent: '#4a0e4e',
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
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    mystical: {
      shadowColor: '#d4af37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  fonts: {
    regular: 'Cinzel-Regular',
    bold: 'Cinzel-Bold',
  },
};

export type Theme = typeof theme;
