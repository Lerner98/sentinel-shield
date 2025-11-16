/**
 * GLOBAL STYLES
 * Pre-composed style combinations for UI patterns
 * NEVER repeat raw styling in components - reference these instead
 */

import { SPACING, BORDERS, SHADOWS, ANIMATIONS, Z_INDEX } from './constants';

export const GLOBAL_STYLES = {
  // BUTTONS
  buttons: {
    base: `
      inline-flex items-center justify-center gap-2
      font-medium transition-all
      disabled:opacity-50 disabled:cursor-not-allowed
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      whitespace-nowrap
    `,
    
    sizes: {
      sm: `h-9 px-3 text-sm rounded-${BORDERS.radius.md}`,
      md: `h-11 px-6 text-base rounded-${BORDERS.radius.lg}`,
      lg: `h-14 px-8 text-lg rounded-${BORDERS.radius.xl}`,
      xl: `h-16 px-10 text-xl rounded-${BORDERS.radius.xl}`,
    },
    
    variants: {
      primary: `
        bg-primary text-neutral-950 
        hover:bg-primary/90 hover:shadow-glow-cyan
        active:scale-95
      `,
      
      secondary: `
        bg-secondary text-primary-foreground 
        hover:bg-secondary/90
        active:scale-95
      `,
      
      outline: `
        border-2 border-primary bg-transparent text-primary
        hover:bg-primary/10 hover:shadow-glow-cyan
        active:scale-95
      `,
      
      ghost: `
        bg-transparent text-foreground
        hover:bg-accent/10
        active:scale-95
      `,
      
      danger: `
        bg-destructive text-destructive-foreground
        hover:bg-destructive/90
        active:scale-95
      `,
      
      gradient: `
        bg-gradient-to-r from-primary to-secondary
        text-white
        hover:shadow-glow-cyanStrong
        active:scale-95
      `,
    },
  },
  
  // CARDS
  cards: {
    base: `
      rounded-${BORDERS.radius.xl} 
      border border-border/50
      backdrop-blur-sm
      transition-all duration-${ANIMATIONS.durations.medium}
    `,
    
    variants: {
      default: `
        bg-card/50 
        hover:bg-card/70 
        hover:border-primary/30
        hover:shadow-lg
      `,
      
      glass: `
        bg-card/20 
        backdrop-blur-md
        border-primary/20
        hover:bg-card/30
        hover:border-primary/40
      `,
      
      solid: `
        bg-card 
        shadow-md
        hover:shadow-xl
      `,
      
      interactive: `
        bg-card/50 
        cursor-pointer
        hover:bg-card/70 
        hover:border-primary/50
        hover:shadow-glow-cyan
        hover:scale-105
        active:scale-100
      `,
      
      danger: `
        bg-destructive/10 
        border-destructive/50
        hover:bg-destructive/20
        hover:border-destructive
      `,
    },
  },
  
  // FORMS
  forms: {
    label: `
      text-sm font-medium text-foreground
      mb-2 block
    `,
    
    input: `
      flex h-11 w-full
      rounded-${BORDERS.radius.lg}
      border border-input
      bg-background/50 backdrop-blur-sm
      px-4 py-2
      text-base text-foreground
      placeholder:text-muted-foreground
      transition-all duration-${ANIMATIONS.durations.base}
      focus-visible:outline-none 
      focus-visible:ring-2 
      focus-visible:ring-primary
      focus-visible:border-primary
      disabled:cursor-not-allowed 
      disabled:opacity-50
    `,
    
    textarea: `
      flex min-h-[120px] w-full
      rounded-${BORDERS.radius.lg}
      border border-input
      bg-background/50 backdrop-blur-sm
      px-4 py-3
      text-base text-foreground
      placeholder:text-muted-foreground
      transition-all duration-${ANIMATIONS.durations.base}
      focus-visible:outline-none 
      focus-visible:ring-2 
      focus-visible:ring-primary
      focus-visible:border-primary
      disabled:cursor-not-allowed 
      disabled:opacity-50
      resize-none
    `,
    
    select: `
      flex h-11 w-full
      items-center justify-between
      rounded-${BORDERS.radius.lg}
      border border-input
      bg-background/50 backdrop-blur-sm
      px-4 py-2
      text-base text-foreground
      transition-all duration-${ANIMATIONS.durations.base}
      focus:outline-none 
      focus:ring-2 
      focus:ring-primary
      focus:border-primary
      disabled:cursor-not-allowed 
      disabled:opacity-50
    `,
    
    error: `
      text-sm text-destructive mt-1
    `,
    
    helper: `
      text-sm text-muted-foreground mt-1
    `,
  },
  
  // LAYOUTS
  layouts: {
    container: `
      w-full mx-auto px-4 sm:px-6 lg:px-8
      max-w-7xl
    `,
    
    section: `
      py-12 md:py-20 lg:py-28
    `,
    
    grid: {
      base: 'grid gap-6',
      cols2: 'grid-cols-1 md:grid-cols-2',
      cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    },
    
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
    flexCol: 'flex flex-col',
  },
  
  // NAVIGATION
  navigation: {
    header: `
      sticky top-0 z-${Z_INDEX.sticky}
      border-b border-border/50
      bg-background/80 backdrop-blur-lg
      transition-all duration-${ANIMATIONS.durations.medium}
    `,
    
    navLink: `
      text-foreground/80
      font-medium text-sm
      transition-colors duration-${ANIMATIONS.durations.base}
      hover:text-primary
      relative
      after:absolute after:bottom-0 after:left-0
      after:h-0.5 after:w-0 after:bg-primary
      after:transition-all after:duration-${ANIMATIONS.durations.medium}
      hover:after:w-full
    `,
    
    navLinkActive: `
      text-primary
      after:w-full
    `,
    
    mobileMenu: `
      fixed inset-0 z-${Z_INDEX.modal}
      bg-background/95 backdrop-blur-lg
      transition-all duration-${ANIMATIONS.durations.medium}
    `,
  },
  
  // TEXT STYLES
  text: {
    h1: `
      text-4xl md:text-5xl lg:text-6xl
      font-bold
      leading-tight
      tracking-tight
    `,
    
    h2: `
      text-3xl md:text-4xl lg:text-5xl
      font-bold
      leading-tight
      tracking-tight
    `,
    
    h3: `
      text-2xl md:text-3xl lg:text-4xl
      font-semibold
      leading-snug
    `,
    
    h4: `
      text-xl md:text-2xl
      font-semibold
      leading-snug
    `,
    
    body: `
      text-base md:text-lg
      leading-relaxed
    `,
    
    small: `
      text-sm
      leading-normal
    `,
    
    gradient: `
      bg-gradient-to-r from-primary to-secondary
      bg-clip-text text-transparent
    `,
  },
  
  // BADGES & TAGS
  badges: {
    base: `
      inline-flex items-center
      rounded-full
      px-3 py-1
      text-xs font-medium
      transition-all duration-${ANIMATIONS.durations.base}
    `,
    
    variants: {
      default: 'bg-primary/10 text-primary border border-primary/20',
      secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
      success: 'bg-success/10 text-success border border-success/20',
      warning: 'bg-warning/10 text-warning border border-warning/20',
      error: 'bg-error/10 text-error border border-error/20',
      
      // Vulnerability severity badges
      critical: 'bg-severity-critical/10 text-severity-critical border border-severity-critical/20',
      high: 'bg-severity-high/10 text-severity-high border border-severity-high/20',
      medium: 'bg-severity-medium/10 text-severity-medium border border-severity-medium/20',
      low: 'bg-severity-low/10 text-severity-low border border-severity-low/20',
    },
  },
  
  // LOADING STATES
  loading: {
    skeleton: `
      animate-pulse
      bg-muted/50
      rounded-${BORDERS.radius.md}
    `,
    
    spinner: `
      animate-spin
      rounded-full
      border-2 border-current border-t-transparent
    `,
  },
  
  // EMPTY STATES
  empty: {
    container: `
      flex flex-col items-center justify-center
      py-16 px-4
      text-center
    `,
    
    icon: `
      w-16 h-16 mb-4
      text-muted-foreground/50
    `,
    
    title: `
      text-xl font-semibold
      text-foreground mb-2
    `,
    
    description: `
      text-muted-foreground
      max-w-md
    `,
  },
} as const;
