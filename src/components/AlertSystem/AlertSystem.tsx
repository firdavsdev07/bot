import React, { useState, createContext, useContext, ReactNode, useEffect } from 'react';
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Help,
  Delete,
  Save,
  Cancel,
} from '@mui/icons-material';
import { 
  subscribeToGlobalAlerts, 
  unsubscribeFromGlobalAlerts 
} from '../../utils/global-alert';

// Alert types
export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type ConfirmType = 'delete' | 'save' | 'cancel' | 'custom';

interface AlertMessage {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
}

interface ConfirmOptions {
  type: ConfirmType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface AlertContextType {
  showAlert: (type: AlertType, message: string, title?: string, duration?: number) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (options: ConfirmOptions) => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new TypeError('useAlert must be used within AlertProvider');
  }
  return context;
};

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmOptions | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  // Subscribe to global alerts
  useEffect(() => {
    subscribeToGlobalAlerts((globalAlerts) => {
      globalAlerts.forEach(alert => {
        showAlert(alert.type, alert.message, alert.title);
      });
    });

    return () => {
      unsubscribeFromGlobalAlerts();
    };
  }, []);

  const getIcon = (type: AlertType) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'error': return <Error />;
      case 'warning': return <Warning />;
      case 'info': return <Info />;
    }
  };

  const getConfirmIcon = (type: ConfirmType) => {
    switch (type) {
      case 'delete': return <Delete color="error" />;
      case 'save': return <Save color="primary" />;
      case 'cancel': return <Cancel color="warning" />;
      default: return <Help color="primary" />;
    }
  };

  const showAlert = (type: AlertType, message: string, title?: string, duration = 4000) => {
    const id = Date.now().toString();
    const newAlert: AlertMessage = { id, type, message, title, duration };
    
    setAlerts(prev => [...prev, newAlert]);
    
    if (duration > 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }, duration);
    }
  };

  const showSuccess = (message: string, title?: string) => showAlert('success', message, title);
  const showError = (message: string, title?: string) => showAlert('error', message, title);
  const showWarning = (message: string, title?: string) => showAlert('warning', message, title);
  const showInfo = (message: string, title?: string) => showAlert('info', message, title);

  const showConfirm = (options: ConfirmOptions) => {
    setConfirmDialog(options);
  };

  const handleConfirm = async () => {
    if (!confirmDialog) return;
    
    setIsConfirmLoading(true);
    try {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    } catch (error) {
      console.error('Confirm action failed:', error);
      showError('Amal bajarilmadi. Qaytadan urinib ko\'ring.');
    } finally {
      setIsConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirmDialog?.onCancel) {
      confirmDialog.onCancel();
    }
    setConfirmDialog(null);
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{
      showAlert,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showConfirm,
    }}>
      {children}

      {/* Snackbar Alerts */}
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxWidth: 400,
        }}
      >
        {alerts.map((alert) => (
          <Alert
            key={alert.id}
            severity={alert.type}
            icon={getIcon(alert.type)}
            onClose={() => removeAlert(alert.id)}
            sx={{
              boxShadow: 3,
              borderRadius: 2,
              '&.MuiAlert-root': {
                borderLeft: '4px solid',
                borderLeftColor: (theme) =>
                  alert.type === 'success' ? theme.palette.success.main :
                  alert.type === 'error' ? theme.palette.error.main :
                  alert.type === 'warning' ? theme.palette.warning.main :
                  theme.palette.info.main,
              },
            }}
          >
            {alert.title && <AlertTitle sx={{ fontWeight: 700 }}>{alert.title}</AlertTitle>}
            <Typography variant="body2">{alert.message}</Typography>
          </Alert>
        ))}
      </Box>

      {/* Confirm Dialog */}
      <Dialog
        open={!!confirmDialog}
        onClose={handleCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        {confirmDialog && (
          <>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
              {getConfirmIcon(confirmDialog.type)}
              <Typography variant="h6" fontWeight={700}>
                {confirmDialog.title}
              </Typography>
            </DialogTitle>
            
            <DialogContent>
              <Typography variant="body1" color="text.secondary">
                {confirmDialog.message}
              </Typography>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, pt: 1 }}>
              <Button
                onClick={handleCancel}
                variant="outlined"
                color="inherit"
                disabled={isConfirmLoading}
              >
                {confirmDialog.cancelText || 'Bekor qilish'}
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                color={
                  confirmDialog.type === 'delete' ? 'error' :
                  confirmDialog.type === 'save' ? 'primary' :
                  confirmDialog.type === 'cancel' ? 'warning' : 'primary'
                }
                disabled={isConfirmLoading}
                sx={{ minWidth: 120 }}
              >
                {isConfirmLoading ? 'Bajarlmoqda...' : (confirmDialog.confirmText || 'Tasdiqlash')}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </AlertContext.Provider>
  );
};