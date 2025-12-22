export const isTelegramWebApp = (): boolean => {
  return !!(window?.Telegram?.WebApp?.initData);
};

export const getTelegramWebApp = () => {
  if (!isTelegramWebApp()) return null;
  return window.Telegram!.WebApp!;
};


export const getTelegramInitData = (): string | null => {
  const webApp = getTelegramWebApp();
  if (!webApp || !webApp.initData) return null;
  return webApp.initData;
};


export const getTelegramUser = () => {
  const webApp = getTelegramWebApp();
  if (!webApp || !webApp.initDataUnsafe?.user) return null;
  
  const user = webApp.initDataUnsafe.user;
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name || '',
    username: user.username || '',
    languageCode: user.language_code || 'uz',
  };
};

export const initTelegramWebApp = () => {
  const webApp = getTelegramWebApp();
  if (!webApp) return false;
  
  webApp.ready();
  webApp.expand();
  
  
  return true;
};


export const authenticateWithTelegram = async (): Promise<{
  token: string;
  profile: any;
} | null> => {
  const initData = getTelegramInitData();
  
  if (!initData) {
    console.error(' [TELEGRAM] initData not found');
    return null;
  }
  
  try {
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.craftly.uz/api/bot'}/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('[TELEGRAM] Auth failed:', errorData);
      return null;
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('[TELEGRAM] Auth error:', error);
    return null;
  }
};


export const checkUserRegistration = async (): Promise<boolean> => {
  const initData = getTelegramInitData();
  
  if (!initData) return false;
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://api.craftly.uz/api/bot'}/auth/check-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });
    
    return response.ok;
  } catch {
    return false;
  }
};