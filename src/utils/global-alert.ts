// Global alert system for non-React contexts (like axios interceptors)
type AlertType = 'success' | 'error' | 'warning' | 'info';

interface GlobalAlert {
  type: AlertType;
  title?: string;
  message: string;
}

// Global alert queue
let globalAlertQueue: GlobalAlert[] = [];
let alertSubscriber: ((alerts: GlobalAlert[]) => void) | null = null;

// Subscribe to global alerts (used by AlertProvider)
export const subscribeToGlobalAlerts = (callback: (alerts: GlobalAlert[]) => void) => {
  alertSubscriber = callback;
  // Send existing alerts
  if (globalAlertQueue.length > 0) {
    callback([...globalAlertQueue]);
    globalAlertQueue = [];
  }
};

// Unsubscribe from global alerts
export const unsubscribeFromGlobalAlerts = () => {
  alertSubscriber = null;
};

// Show global alert (can be called from anywhere)
export const showGlobalAlert = (type: AlertType, message: string, title?: string) => {
  const alert: GlobalAlert = { type, message, title };
  
  if (alertSubscriber) {
    // If subscriber exists, send immediately
    alertSubscriber([alert]);
  } else {
    // Otherwise, queue for later
    globalAlertQueue.push(alert);
  }
};

// Convenience methods
export const showGlobalError = (message: string, title?: string) => 
  showGlobalAlert('error', message, title);

export const showGlobalSuccess = (message: string, title?: string) => 
  showGlobalAlert('success', message, title);

export const showGlobalWarning = (message: string, title?: string) => 
  showGlobalAlert('warning', message, title);

export const showGlobalInfo = (message: string, title?: string) => 
  showGlobalAlert('info', message, title);