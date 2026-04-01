export const theme = {
  colors: {
    // Cream palette
    bg: '#FDF6EC',           // page background
    surface: '#FAF0E1',      // column background
    card: '#FFFDF9',         // card background
    cardHover: '#FFFFFF',
    border: '#E8DCC8',       // subtle warm borders
    borderLight: '#F0E6D4',

    // Text
    textPrimary: '#2D2418',
    textSecondary: '#7A6E5D',
    textMuted: '#B0A48E',

    // Accent
    accent: '#D4763A',        // warm orange accent for buttons
    accentHover: '#C06830',
    accentLight: '#FFF0E5',

    // Feedback
    error: '#dc2626',
    errorBg: '#fef2f2',
    errorBorder: '#fecaca',
    success: '#16a34a',
    dropHighlight: '#FFF0E5',
  },

  // Type scale
  font: {
    family: "'Comfortaa', cursive",
    size: {
      xs: '0.65rem',
      sm: '0.75rem',
      base: '0.85rem',
      md: '0.95rem',
      lg: '1.1rem',
      xl: '1.35rem',
    },
    weight: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  radius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
  },

  shadow: {
    card: '0 1px 3px rgba(45, 36, 24, 0.06)',
    cardDragging: '0 12px 28px rgba(45, 36, 24, 0.15)',
    modal: '0 20px 60px rgba(45, 36, 24, 0.2)',
  },
};