/**
 * Mock Authentication for Local Development
 * 
 * Localhost'da test qilish uchun
 * Production'da ishlamaydi
 */

export interface MockUser {
  _id: string;
  telegramId: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

// Get default mock user from .env
const getDefaultMockUser = (): MockUser | null => {
  const id = import.meta.env.VITE_MOCK_USER_ID;
  const telegramId = import.meta.env.VITE_MOCK_TELEGRAM_ID;
  const firstName = import.meta.env.VITE_MOCK_FIRST_NAME;
  const lastName = import.meta.env.VITE_MOCK_LAST_NAME;
  const phone = import.meta.env.VITE_MOCK_PHONE;
  const role = import.meta.env.VITE_MOCK_ROLE;

  if (id && telegramId) {
    return {
      _id: id,
      telegramId: telegramId,
      firstName: firstName || "Test",
      lastName: lastName || "User",
      phone: phone || "+998901234567",
      role: role || "manager",
    };
  }

  return null;
};

// Test managerlar ro'yxati (fallback)
export const MOCK_USERS: MockUser[] = [
  {
    _id: "686e7881ab577df7c3eb3db2",
    telegramId: "123456789",
    firstName: "Test",
    lastName: "Manager",
    phone: "+998901234567",
    role: "manager",
  },
  {
    _id: "686e7881ab577df7c3eb3db3",
    telegramId: "987654321",
    firstName: "Test",
    lastName: "Admin",
    phone: "+998901234568",
    role: "admin",
  },
  {
    _id: "686e7881ab577df7c3eb3db4",
    telegramId: "555555555",
    firstName: "Test",
    lastName: "Seller",
    phone: "+998901234569",
    role: "seller",
  },
];

// Get default mock user or first from list
export const getDefaultMockUserOrFirst = (): MockUser => {
  return getDefaultMockUser() || MOCK_USERS[0];
};

/**
 * Check if we're in development mode
 */
export const isDevelopment = () => {
  return (
    import.meta.env.DEV || 
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

/**
 * Get mock user from localStorage
 */
export const getMockUser = (): MockUser | null => {
  if (!isDevelopment()) return null;
  
  const mockUserStr = localStorage.getItem("mockUser");
  if (!mockUserStr) return null;
  
  try {
    return JSON.parse(mockUserStr);
  } catch {
    return null;
  }
};

/**
 * Set mock user to localStorage
 */
export const setMockUser = (user: MockUser | null) => {
  if (!isDevelopment()) return;
  
  if (user) {
    localStorage.setItem("mockUser", JSON.stringify(user));
    // Store token too
    localStorage.setItem("token", `mock_token_${user._id}`);
  } else {
    localStorage.removeItem("mockUser");
    localStorage.removeItem("token");
  }
};

/**
 * Check if mock mode is enabled
 */
export const isMockMode = (): boolean => {
  return isDevelopment() && !!getMockUser();
};

/**
 * Clear mock data
 */
export const clearMockUser = () => {
  localStorage.removeItem("mockUser");
  localStorage.removeItem("token");
};
