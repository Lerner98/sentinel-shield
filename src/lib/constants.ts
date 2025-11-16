/**
 * DESIGN SYSTEM CONSTANTS
 * Single source of truth for all design tokens
 */

// SPACING
export const SPACING = {
  // Base units (in px, converted to rem in usage)
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
  
  // Container widths
  container: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // Section padding
  section: {
    mobile: '3rem',   // 48px
    tablet: '5rem',   // 80px
    desktop: '8rem',  // 128px
  },
} as const;

// COLORS - All HSL values
export const COLORS = {
  // Primary - Electric Cyan (cybersecurity theme)
  primary: {
    50: '188 100% 95%',
    100: '188 100% 90%',
    200: '188 100% 80%',
    300: '188 100% 70%',
    400: '188 100% 60%',
    DEFAULT: '188 100% 50%',  // Main cyan
    600: '188 100% 45%',
    700: '188 100% 40%',
    800: '188 90% 35%',
    900: '188 80% 30%',
  },
  
  // Secondary - Deep Blue
  secondary: {
    50: '220 25% 95%',
    100: '220 25% 85%',
    200: '220 25% 75%',
    300: '220 25% 65%',
    400: '220 25% 55%',
    DEFAULT: '220 25% 45%',
    600: '220 25% 35%',
    700: '220 25% 25%',
    800: '220 25% 15%',
    900: '220 25% 10%',
  },
  
  // Accent - Warning Orange
  accent: {
    50: '25 100% 95%',
    100: '25 100% 85%',
    200: '25 100% 75%',
    300: '25 100% 65%',
    DEFAULT: '25 100% 55%',  // Orange for alerts
    600: '25 100% 45%',
    700: '25 90% 40%',
    800: '25 80% 35%',
    900: '25 70% 30%',
  },
  
  // Semantic colors
  success: '142 76% 36%',    // Green
  warning: '38 92% 50%',     // Amber
  error: '0 72% 51%',        // Red
  info: '199 89% 48%',       // Light blue
  
  // Neutrals - Slate tones for dark theme
  neutral: {
    50: '210 20% 98%',
    100: '210 20% 96%',
    200: '214 15% 91%',
    300: '213 13% 83%',
    400: '215 11% 65%',
    DEFAULT: '215 16% 47%',
    600: '215 19% 35%',
    700: '215 25% 27%',
    800: '217 33% 17%',  // Main dark background
    900: '222 47% 11%',  // Darker background
    950: '229 84% 5%',   // Darkest
  },
  
  // Vulnerability severity levels
  severity: {
    critical: '0 72% 51%',    // Red
    high: '25 100% 55%',      // Orange
    medium: '38 92% 50%',     // Amber
    low: '142 76% 36%',       // Green
    info: '199 89% 48%',      // Blue
  },
} as const;

// TYPOGRAPHY
export const TYPOGRAPHY = {
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
  },
  
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// BORDERS
export const BORDERS = {
  widths: {
    none: '0',
    thin: '1px',
    base: '2px',
    thick: '4px',
  },
  
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },
} as const;

// SHADOWS
export const SHADOWS = {
  sm: '0 1px 2px 0 hsl(222 47% 11% / 0.05)',
  base: '0 1px 3px 0 hsl(222 47% 11% / 0.1), 0 1px 2px -1px hsl(222 47% 11% / 0.1)',
  md: '0 4px 6px -1px hsl(222 47% 11% / 0.1), 0 2px 4px -2px hsl(222 47% 11% / 0.1)',
  lg: '0 10px 15px -3px hsl(222 47% 11% / 0.1), 0 4px 6px -4px hsl(222 47% 11% / 0.1)',
  xl: '0 20px 25px -5px hsl(222 47% 11% / 0.1), 0 8px 10px -6px hsl(222 47% 11% / 0.1)',
  '2xl': '0 25px 50px -12px hsl(222 47% 11% / 0.25)',
  
  // Glow effects for cyber theme
  glow: {
    cyan: '0 0 20px hsl(188 100% 50% / 0.3)',
    cyanStrong: '0 0 40px hsl(188 100% 50% / 0.5)',
    orange: '0 0 20px hsl(25 100% 55% / 0.3)',
    orangeStrong: '0 0 40px hsl(25 100% 55% / 0.5)',
  },
  
  inner: 'inset 0 2px 4px 0 hsl(222 47% 11% / 0.05)',
  none: 'none',
} as const;

// ANIMATIONS
export const ANIMATIONS = {
  durations: {
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  
  easings: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Z-INDEX layers
export const Z_INDEX = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  notification: 1700,
} as const;

// BREAKPOINTS (mobile-first)
export const BREAKPOINTS = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// UI LIMITS
export const UI_LIMITS = {
  fileUpload: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    allowedTypes: ['image/*', 'application/pdf', '.doc', '.docx'],
  },
  
  input: {
    maxLength: {
      short: 100,
      medium: 500,
      long: 2000,
    },
    minLength: {
      password: 8,
      search: 2,
    },
  },
  
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
} as const;
