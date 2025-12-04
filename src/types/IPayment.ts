export interface ICurrencyDetails {
  dollar: number;
  sum: number;
}

export interface IPaydata {
  id: string;
  amount: number;
  notes: string;
  customerId: string;
  currencyDetails: ICurrencyDetails;
  currencyCourse: number;
  targetMonth?: number;
}

export interface IPayment {
    _id?: string;
    date: Date | string;
    amount: number;
    actualAmount?: number;
    isPaid: boolean;
    paymentType?: string;
    status?: string;
    remainingAmount?: number;
    excessAmount?: number;
    expectedAmount?: number;
    confirmedAt?: Date | string;
    notes?: string;
    targetMonth?: number; // ✅ Qaysi oy uchun to'lov
    reminderDate?: string | Date; // ✅ YANGI: Eslatma sanasi
    customerId?: any;
    managerId?: any;
}
