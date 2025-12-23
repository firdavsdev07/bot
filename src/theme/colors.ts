

export const colors = {
  // Primary - Professional Blue (no gradient)
  primary: {
    main: '#2563eb',
    light: '#60a5fa',
    dark: '#1e40af',
    shadow: 'rgba(37, 99, 235, 0.15)',
  },
  
  // Success - Professional Green (no gradient)
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    shadow: 'rgba(16, 185, 129, 0.15)',
  },
  
  // Error - Professional Red (no gradient)
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    shadow: 'rgba(239, 68, 68, 0.15)',
  },
  
  // Warning - Professional Orange (no gradient)
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    shadow: 'rgba(245, 158, 11, 0.15)',
  },
  
  // Info - Professional Cyan (no gradient)
  info: {
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0284c7',
    shadow: 'rgba(14, 165, 233, 0.15)',
  },
  
  // Neutrals
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Background
  background: {
    default: '#fafbfc',
    paper: '#ffffff',
    elevated: '#ffffff',
  },
};

export const shadows = {
  sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  colored: (color: string) => `0 8px 24px ${color}`,
};

export const borderRadius = {
  sm: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  full: '9999px',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
};

export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  dark: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  },
};

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};
