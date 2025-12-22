
export interface MockUser {
  _id: string;
  telegramId: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

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

export const getDefaultMockUserOrFirst = (): MockUser => {
  return getDefaultMockUser() || MOCK_USERS[0];
};


export const isDevelopment = () => {
  return (
    import.meta.env.DEV || 
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
};

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

export const setMockUser = (user: MockUser | null) => {
  if (!isDevelopment()) return;
  
  if (user) {
    localStorage.setItem("mockUser", JSON.stringify(user));
    localStorage.setItem("token", `mock_token_${user._id}`);
  } else {
    localStorage.removeItem("mockUser");
    localStorage.removeItem("token");
  }
};


export const isMockMode = (): boolean => {
  return isDevelopment() && !!getMockUser();
};

export const clearMockUser = () => {
  localStorage.removeItem("mockUser");
  localStorage.removeItem("token");
};
