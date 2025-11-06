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
}
