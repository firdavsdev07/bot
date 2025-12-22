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
    reminderDate?: string | Date; 
    nextPaymentDate?: string | Date; 
    customerId?: any;
    managerId?: any;
}
