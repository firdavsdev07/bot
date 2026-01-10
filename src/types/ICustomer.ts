export type ICustomer = {
  _id: string;
  customerId?: string;
  fullName: string;
  phoneNumber: string;
  delayDays?: number;
};

export type ICustomerDetails = {
  _id: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  totalDebt: number;
  totalPaid: number;
  remainingDebt: number;
  delayDays?: number;
};

export type PaymentType = "initial" | "monthly" | "extra";
export type PaymentStatus = "PAID" | "UNDERPAID" | "OVERPAID" | "PENDING" | "REJECTED";

export type ICustomerContract = {
  _id: string;
  contractId?: string; // ✅ YANGI - Shartnoma ID (S0001, S0002...)
  productName: string;
  totalDebt: number;
  totalPaid: number;
  remainingDebt: number;
  monthlyPayment: number;
  debtorId?: string;
  nextPaymentDate?: string;
  previousPaymentDate?: string; // Eski sana (o'zgartirilgan bo'lsa)
  postponedAt?: string; // Qachon o'zgartirilgan
  originalPaymentDay?: number; // Asl to'lov kuni (1-31)
  paidMonthsCount?: number;
  durationMonths?: number;
  period?: number; // Backend'dan keladi
  initialPayment?: number;
  initialPaymentDueDate?: string;
  startDate?: string;
  prepaidBalance?: number;
  payments?: Array<{
    _id?: string;
    paymentId?: string; // ✅ YANGI - To'lov ID (T0001, T0002...)
    amount: number;
    actualAmount?: number;
    date: Date | string;
    isPaid: boolean;
    paymentType?: PaymentType;
    status?: PaymentStatus;
    remainingAmount?: number;
    excessAmount?: number;
    expectedAmount?: number;
    confirmedAt?: Date | string;
    notes?: string;
    targetMonth?: number;
    reminderDate?: Date | string; // ✅ YANGI - Eslatma sanasi
    reminderComment?: string; // ✅ YANGI - Eslatma izohi
  }>;
};

// ✅ YANGI: Qarzdor shartnomalar uchun type (har bir shartnoma alohida)
export type IDebtorContract = {
  _id: string; // Contract ID
  customerId: string; // Customer ID
  fullName: string;
  phoneNumber: string;
  productName: string; // ✅ Shartnoma nomi
  contractId?: string; // ✅ Shartnoma ID (S0001, S0002...)
  paymentId?: string; // ✅ To'lov ID (T0001, T0002...) - Qarzdorlik bo'yicha to'lov
  debtorId?: string; // ✅ Qarzdor ID (backend'dan keladi)
  remainingDebt: number; // ✅ Shu shartnomaning qarzi
  delayDays: number; // ✅ Shu shartnomaning kechikishi
  nextPaymentDate: string;
  totalPrice: number;
  totalPaid: number;
  startDate?: string; // ✅ Shartnoma boshlangan sana
  initialPaymentDueDate?: string; // ✅ Birinchi to'lov sanasi (kun muhim!)
  originalPaymentDay?: number; // ✅ Asl to'lov kuni (1-31)
  period?: number; // ✅ Umumiy muddat (oylar)
  paidMonthsCount?: number; // ✅ To'langan oylar soni
  monthlyPayment?: number; // ✅ Oylik to'lov
  initialPayment?: number; // ✅ Boshlang'ich to'lov
  isPending?: boolean; // ✅ YANGI: Kassa kutayotgan to'lov bormi?
};
