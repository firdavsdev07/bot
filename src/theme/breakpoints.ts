// Professional breakpoint system
// Mobile: 0-767px (includes 500px+)
// Tablet: 768-1023px
// Desktop: 1024px+

const breakpointValues = {
  xs: 0,        // Extra small devices
  sm: 500,      // Small mobile devices (added as requested)
  md: 768,      // Tablets
  lg: 1024,     // Desktop
  xl: 1440,     // Large desktop
};

export const breakpoints = {
  values: breakpointValues,
  
  // Media query helpers
  up: (breakpoint: keyof typeof breakpointValues) => 
    `@media (min-width: ${breakpointValues[breakpoint]}px)`,
  
  down: (breakpoint: keyof typeof breakpointValues) => 
    `@media (max-width: ${breakpointValues[breakpoint] - 1}px)`,
  
  between: (start: keyof typeof breakpointValues, end: keyof typeof breakpointValues) => 
    `@media (min-width: ${breakpointValues[start]}px) and (max-width: ${breakpointValues[end] - 1}px)`,
};

// Device type helpers
export const device = {
  mobile: breakpoints.down('md'),      // 0-767px
  tablet: breakpoints.between('md', 'lg'),  // 768-1023px
  desktop: breakpoints.up('lg'),       // 1024px+
  
  // Small mobile variant (500px+)
  mobileSmall: breakpoints.down('sm'),  // 0-499px
  mobileLarge: breakpoints.between('sm', 'md'),  // 500-767px
};
