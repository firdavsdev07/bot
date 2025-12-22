type AlertType = 'success' | 'error' | 'warning' | 'info';

interface GlobalAlert {
  type: AlertType;
  title?: string;
  message: string;
}

let globalAlertQueue: GlobalAlert[] = [];
let alertSubscriber: ((alerts: GlobalAlert[]) => void) | null = null;

export const subscribeToGlobalAlerts = (callback: (alerts: GlobalAlert[]) => void) => {
  alertSubscriber = callback;
  if (globalAlertQueue.length > 0) {
    callback([...globalAlertQueue]);
    globalAlertQueue = [];
  }
};

export const unsubscribeFromGlobalAlerts = () => {
  alertSubscriber = null;
};

export const showGlobalAlert = (type: AlertType, message: string, title?: string) => {
  const alert: GlobalAlert = { type, message, title };
  
  if (alertSubscriber) {
    alertSubscriber([alert]);
  } else {
    globalAlertQueue.push(alert);
  }
};

export const showGlobalError = (message: string, title?: string) => 
  showGlobalAlert('error', message, title);

export const showGlobalSuccess = (message: string, title?: string) => 
  showGlobalAlert('success', message, title);

export const showGlobalWarning = (message: string, title?: string) => 
  showGlobalAlert('warning', message, title);

export const showGlobalInfo = (message: string, title?: string) => 
  showGlobalAlert('info', message, title);