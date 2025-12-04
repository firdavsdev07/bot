/**
 * Error Messages - O'zbek tilida
 * 
 * Backend'dan kelgan error code'larni o'zbek tiliga tarjima qilish
 */

export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication Errors (1xxx)
  AUTH_1001: "Login yoki parol noto'g'ri",
  AUTH_1002: "Ruxsat berilmagan. Iltimos qayta kiring",
  AUTH_1003: "Sessiya tugadi. Iltimos qayta kiring",
  AUTH_1004: "Noto'g'ri token",
  AUTH_1005: "Telefon raqami kiritilishi shart",
  
  // Payment Errors (2xxx)
  PAYMENT_2001: "To'lov topilmadi",
  PAYMENT_2002: "To'lov allaqachon tasdiqlangan",
  PAYMENT_2003: "To'lov allaqachon rad etilgan",
  PAYMENT_2004: "To'lov muddati o'tgan (24 soat)",
  PAYMENT_2005: "Noto'g'ri to'lov summasi",
  PAYMENT_2006: "Balans yetarli emas",
  PAYMENT_2007: "To'lov tasdiqlash kutilmayapti",
  
  // Contract Errors (3xxx)
  CONTRACT_3001: "Shartnoma topilmadi",
  CONTRACT_3002: "Shartnoma allaqachon to'liq to'langan",
  CONTRACT_3003: "Shartnoma bekor qilingan",
  CONTRACT_3004: "Noto'g'ri shartnoma ma'lumotlari",
  CONTRACT_3005: "Shartnomada tasdiqlash kutilayotgan to'lovlar bor",
  
  // Customer Errors (4xxx)
  CUSTOMER_4001: "Mijoz topilmadi",
  CUSTOMER_4002: "Mijozning faol shartnomalari mavjud",
  CUSTOMER_4003: "Bu mijoz allaqachon mavjud",
  CUSTOMER_4004: "Noto'g'ri mijoz ma'lumotlari",
  
  // General Errors (9xxx)
  ERROR_9001: "Serverda xatolik yuz berdi",
  ERROR_9002: "Ma'lumotlar noto'g'ri kiritilgan",
  ERROR_9003: "Ma'lumot topilmadi",
  ERROR_9004: "Noto'g'ri so'rov",
  ERROR_9005: "Ma'lumotlar bazasida xatolik",
  
  // Default
  UNKNOWN_ERROR: "Noma'lum xatolik yuz berdi",
};

/**
 * Get error message by code
 */
export function getErrorMessage(errorCode?: string): string {
  if (!errorCode) return ERROR_MESSAGES.UNKNOWN_ERROR;
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Extract error code from error object
 */
export function extractErrorCode(error: any): string | undefined {
  return error?.response?.data?.errorCode || 
         error?.errorCode || 
         error?.code;
}

/**
 * Get user-friendly error message from error object
 */
export function getUserErrorMessage(error: any): string {
  const errorCode = extractErrorCode(error);
  return getErrorMessage(errorCode);
}

export default ERROR_MESSAGES;
