/**
 * Responsive helper utilities
 */

/**
 * Smart text truncation based on screen size
 */
export const truncateText = (text: string, mobileMax: number, desktopMax?: number) => {
  const isMobile = window.innerWidth < 768;
  const maxLength = isMobile ? mobileMax : (desktopMax || mobileMax * 2);
  
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string, isMobile: boolean = false) => {
  if (isMobile && phone.length > 13) {
    return `${phone.slice(0, 13)}...`;
  }
  return phone;
};

/**
 * Smart name display
 */
export const formatName = (firstName: string, lastName: string, isMobile: boolean = false) => {
  const fullName = `${firstName} ${lastName}`;
  
  if (isMobile && fullName.length > 18) {
    return `${firstName} ${lastName.charAt(0)}.`;
  }
  return fullName;
};

/**
 * Format currency with smart abbreviation
 */
export const formatCurrency = (amount: number, currency: "USD" | "UZS", isMobile: boolean = false) => {
  if (isMobile && amount > 1000000) {
    const millions = Math.round(amount / 1000000);
    return `${millions}M ${currency === "USD" ? "$" : "UZS"}`;
  }
  
  if (isMobile && amount > 1000) {
    const thousands = Math.round(amount / 1000);
    return `${thousands}K ${currency === "USD" ? "$" : "UZS"}`;
  }
  
  return `${amount.toLocaleString()} ${currency === "USD" ? "$" : "UZS"}`;
};

/**
 * Get responsive icon size
 */
export const getIconSize = (size: "small" | "medium" | "large" = "medium") => {
  const isMobile = window.innerWidth < 768;
  
  const sizes = {
    small: { mobile: 16, desktop: 18 },
    medium: { mobile: 20, desktop: 24 },
    large: { mobile: 24, desktop: 28 }
  };
  
  return isMobile ? sizes[size].mobile : sizes[size].desktop;
};

/**
 * Check if device is mobile
 */
export const isMobileDevice = () => {
  return window.innerWidth < 768;
};

/**
 * Get responsive spacing
 */
export const getSpacing = (size: "small" | "medium" | "large" = "medium") => {
  const isMobile = window.innerWidth < 768;
  
  const spacing = {
    small: { mobile: 1, desktop: 1.5 },
    medium: { mobile: 1.5, desktop: 2 },
    large: { mobile: 2, desktop: 3 }
  };
  
  return isMobile ? spacing[size].mobile : spacing[size].desktop;
};