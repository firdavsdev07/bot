import toast from 'react-hot-toast';

// Professional toast configurations
const toastConfig = {
  duration: 3000,
  position: 'top-center' as const,
  style: {
    borderRadius: '6px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
  },
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      ...toastConfig,
      icon: '✓',
      style: {
        ...toastConfig.style,
        background: '#10b981',
        color: '#fff',
      },
    });
  },
  
  error: (message: string) => {
    toast.error(message, {
      ...toastConfig,
      icon: '✕',
      style: {
        ...toastConfig.style,
        background: '#ef4444',
        color: '#fff',
      },
    });
  },
  
  info: (message: string) => {
    toast(message, {
      ...toastConfig,
      icon: 'ℹ',
      style: {
        ...toastConfig.style,
        background: '#0ea5e9',
        color: '#fff',
      },
    });
  },
  
  warning: (message: string) => {
    toast(message, {
      ...toastConfig,
      icon: '⚠',
      style: {
        ...toastConfig.style,
        background: '#f59e0b',
        color: '#fff',
      },
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        background: '#fff',
        color: '#1F2937',
      },
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      ...toastConfig,
    });
  },
};
