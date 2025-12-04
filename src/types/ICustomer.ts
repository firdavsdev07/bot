export type ICustomer = {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  delayDays?: number;
};

export type ICustomerDetails = {
  _id: string;
  firstName: string;
  lastName: string;
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
  prepaidBalance?: number; // ✅ YANGI - Oldindan to'langan balans
  payments?: Array<{
    _id?: string;
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
  }>;
};
