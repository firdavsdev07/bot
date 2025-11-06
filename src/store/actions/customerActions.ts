/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  start,
  failure,
  setCustomers,
  setCustomersDebtor,
  setCustomersPatment,
  setCustomerDetails,
  setCustomerContracts,
} from "../slices/customerSlice";

import type { AppThunk } from "../index";
import authApi from "../../server/auth";
import { IPaydata } from "../../types/IPayment";

export const getCustomers = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/customer/get-all");
    const { data } = res;
    dispatch(setCustomers(data.data));
  } catch (error: any) {
    dispatch(failure());
  }
};

export const getCustomersDebtor = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/customer/get-debtor");
    const { data } = res;
    dispatch(setCustomersDebtor(data.data));
  } catch (error: any) {
    dispatch(failure());
  }
};

export const getCustomersPayment = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/customer/get-payment");
    const { data } = res;
    dispatch(setCustomersPatment(data.data));
  } catch (error: any) {
    dispatch(failure());
  }
};

export const getCustomer =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      const res = await authApi.get(`/customer/get-by-id/${id}`);
      const { data } = res;
      dispatch(setCustomerDetails(data.data));
    } catch (error: any) {
      dispatch(failure());
    }
  };

export const getContract =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      const res = await authApi.get(`/customer/get-contract-by-id/${id}`);
      const { data } = res;
      dispatch(setCustomerContracts(data.data));
    } catch (error: any) {
      dispatch(failure());
    }
  };

export const payDebt =
  (payData: IPaydata): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.post("/payment/pay-debt", payData);
      dispatch(getContract(payData.customerId));
    } catch (error: any) {
      dispatch(failure());
    }
  };

export const payNewDebt =
  (payData: IPaydata): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.post("/payment/pay-new-debt", payData);
      dispatch(getContract(payData.customerId));
    } catch (error: any) {
      dispatch(failure());
    }
  };
