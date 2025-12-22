

export const colors = {
  // Primary - Purple gradient
  primary: {
    main: '#667eea',
    light: '#8b9bff',
    dark: '#4c63d2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    shadow: 'rgba(102, 126, 234, 0.3)',
  },
  
  // Success - Green gradient
  success: {
    main: '#11998e',
    light: '#38ef7d',
    dark: '#0d7a72',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    shadow: 'rgba(17, 153, 142, 0.3)',
  },
  
  // Error - Red gradient
  error: {
    main: '#eb3349',
    light: '#f45c43',
    dark: '#c42a3d',
    gradient: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
    shadow: 'rgba(235, 51, 73, 0.3)',
  },
  
  // Warning - Pink/Orange gradient
  warning: {
    main: '#f093fb',
    light: '#f5576c',
    dark: '#d87aed',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    shadow: 'rgba(240, 147, 251, 0.3)',
  },
  
  // Info - Blue gradient
  info: {
    main: '#4facfe',
    light: '#00f2fe',
    dark: '#3d8bd4',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    shadow: 'rgba(79, 172, 254, 0.3)',
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
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
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
