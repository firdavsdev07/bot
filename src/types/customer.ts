export interface ICustomer {
  _id: string;
  customerId: string;
  fullName: string;
  passportSeries: string;
  phoneNumber: string;
  percent: number;
  address: string;
  birthDate: Date;
  telegramName: string;
  telegramId: string;
  isActive: boolean;
  isDelete: boolean;
  isVerified: boolean;
  createdAt: Date;
  managerId: string;
}

export interface IAddCustomer {
  fullName: string;
  passportSeries: string;
  phoneNumber: string;
  birthDate: Date;
  percent: number;
  address: string;
  managerId: string;
}

export interface IEditCustomer {
  _id: string;
  fullName: string;
  passportSeries: string;
  phoneNumber: string;
  birthDate: Date;
  percent: number;
  address: string;
  managerId: string;
}
