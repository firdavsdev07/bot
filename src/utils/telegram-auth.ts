/**
 * Real Telegram Web App Authentication
 * Production uchun haqiqiy Telegram auth tizimi
 */

// Use existing telegram.d.ts types

/**
 * Check if we're running inside Telegram Web App
 */
export const isTelegramWebApp = (): boolean => {
  return !!(window?.Telegram?.WebApp?.initData);
};

/**
 * Get Telegram Web App instance
 */
export const getTelegramWebApp = () => {
  if (!isTelegramWebApp()) return null;
  return window.Telegram!.WebApp!;
};

/**
 * Get Telegram initData for authentication
 */
export const getTelegramInitData = (): string | null => {
  const webApp = getTelegramWebApp();
  if (!webApp || !webApp.initData) return null;
  return webApp.initData;
};

/**
 * Get user info from Telegram Web App
 */
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

/**
 * Initialize Telegram Web App
 */
export const initTelegramWebApp = () => {
  const webApp = getTelegramWebApp();
  if (!webApp) return false;
  
  // Notify Telegram that the Web App is ready
  webApp.ready();
  
  // Expand to full height
  webApp.expand();
  
  console.log('🚀 [TELEGRAM] Web App initialized');
  console.log('📱 [TELEGRAM] initData length:', webApp.initData?.length || 0);
  console.log('👤 [TELEGRAM] User:', getTelegramUser());
  
  return true;
};

/**
 * Authenticate with backend using Telegram initData
 */
export const authenticateWithTelegram = async (): Promise<{
  token: string;
  profile: any;
} | null> => {
  const initData = getTelegramInitData();
  
  if (!initData) {
    console.error('❌ [TELEGRAM] initData not found');
    return null;
  }
  
  try {
    console.log('🔐 [TELEGRAM] Authenticating with backend...');
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/telegram`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ initData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ [TELEGRAM] Auth failed:', errorData);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ [TELEGRAM] Authentication successful');
    console.log('👤 [TELEGRAM] Profile:', data.profile);
    
    return data;
  } catch (error) {
    console.error('❌ [TELEGRAM] Auth error:', error);
    return null;
  }
};

/**
 * Check if user needs phone registration
 */
export const checkUserRegistration = async (): Promise<boolean> => {
  const initData = getTelegramInitData();
  
  if (!initData) return false;
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/check-registration`, {
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