import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";
import {
  ICustomer,
  ICustomerContract,
  ICustomerDetails,
} from "../../types/ICustomer";

type CustomerContracts = {
  allContracts: ICustomerContract[] | [];
  paidContracts: ICustomerContract[] | [];
  debtorContracts: ICustomerContract[] | [];
} | null;

export interface UserState {
  customers: ICustomer[] | [];
  customersDebtor: ICustomer[] | [];
  customersPayment: ICustomer[] | [];
  customerContracts: CustomerContracts;
  customer: ICustomer | null;
  customerDetails: ICustomerDetails | null;
  isLoading: boolean;
}

const initialState: UserState = {
  customers: [],
  customersDebtor: [],
  customersPayment: [],
  customerContracts: null,
  customer: null,
  customerDetails: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers(state, action: PayloadAction<ICustomer[] | []>) {
      state.isLoading = false;
      state.customers = action.payload;
    },
    setCustomersDebtor(state, action: PayloadAction<ICustomer[] | []>) {
      state.isLoading = false;
      state.customersDebtor = action.payload;
    },
    setCustomersPatment(state, action: PayloadAction<ICustomer[] | []>) {
      state.isLoading = false;
      state.customersPayment = action.payload;
    },
    setCustomerContracts(
      state,
      action: PayloadAction<CustomerContracts | null>
    ) {
      state.isLoading = false;
      state.customerContracts = action.payload;
    },
    setCustomerData(state, action: PayloadAction<ICustomer | null>) {
      state.isLoading = false;
      state.customer = action.payload;
    },
    setCustomerDetails(state, action: PayloadAction<ICustomerDetails | null>) {
      state.isLoading = false;
      state.customerDetails = action.payload;
    },

    start(state) {
      state.isLoading = true;
    },
    success(state) {
      state.isLoading = false;
    },
    failure(state) {
      state.isLoading = false;
    },
  },
});

export const {
  setCustomers,
  setCustomersDebtor,
  setCustomersPatment,
  setCustomerContracts,
  setCustomerData,
  setCustomerDetails,
  start,
  success,
  failure,
} = authSlice.actions;
export default authSlice.reducer;
