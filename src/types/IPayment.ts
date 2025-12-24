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
  nextPaymentDate?: string; 
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
    targetMonth?: number; 
 
    nextPaymentDate?: string | Date; 
    reminderDate?: string | Date; // ✅ YANGI - Manager tomonidan belgilangan eslatma sanasi
    customerId?: any;
    managerId?: any;
}
