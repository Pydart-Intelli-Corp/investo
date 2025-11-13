// Theme.js - Design System Variables
const theme = {
  colors: {
    primary: '#FFD700', // Gold
    secondary: '#FFFFFF', // White text for dark background
    accent: '#FFC700', // Lighter gold accent
    white: '#000000', // Changed to black for dark theme
    black: '#000000', // Added explicit black
    text: '#FFFFFF', // White text
    textSecondary: '#CCCCCC', // Light gray text
    background: '#000000', // Black background
    cardBackground: '#1a1a1a', // Dark gray for cards/panels
    surface: '#2a2a2a', // Slightly lighter for elevated surfaces
    border: 'rgba(255, 215, 0, 0.2)', // Gold border for dark theme
    gray: {
      light: '#2a2a2a', // Dark gray for dark theme
      medium: '#6a6a6a', // Medium gray adjusted for dark theme
      dark: '#cccccc' // Light gray for text on dark background
    },
    bronze: '#CD7F32',
    goldGradient: 'linear-gradient(90deg, #ffd700, #fffec7, #ffd700)',
  },
  fonts: {
    primary: "'Montserrat', 'Open Sans', sans-serif",
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  fontSizes: {
    small: '14px',
    base: '16px',
    medium: '18px',
    large: '24px',
    xlarge: '32px',
    xxlarge: '48px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
  },
  shadows: {
    small: '0 2px 4px rgba(255, 255, 255, 0.1)',
    medium: '0 4px 8px rgba(255, 255, 255, 0.1)',
    large: '0 8px 16px rgba(255, 255, 255, 0.1)',
    gold: '0 0 15px #FFD700',
    goldIntense: '0 0 30px #FFD700',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1200px',
    wide: '1400px',
  },
  transitions: {
    default: '0.3s ease',
    slow: '0.5s ease-in-out',
    fast: '0.2s ease-out',
  },
  zIndices: {
    base: 0,
    navigation: 100,
    modal: 200,
    tooltip: 300,
  },
  grid: {
    containerWidth: '1200px',
    containerWidthTablet: '900px',
    containerWidthMobile: '100%',
    columns: 12,
    gutter: '24px',
    gutterMobile: '16px',
  },
};

export default theme;
