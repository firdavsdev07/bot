export type ICustomer = {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
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
};

export type ICustomerContract = {
  _id: string;
  productName: string;
  totalDebt: number;
  totalPaid: number;
  remainingDebt: number;
  monthlyPayment: number;
  debtorId: string;
  payments?: Array<{
    amount: number;
    date: string;
    isPaid: boolean;
  }>;
};
