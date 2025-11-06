import { ICurrencyDetails } from "./IPayment";

export interface IExpenses {
  id: string;
  notes: string;
  currencyDetails: ICurrencyDetails;
}

export interface IAddExpenses {
  notes: string;
  currencyDetails: ICurrencyDetails;
}

export type IUpdateExpenses = IExpenses;
