
import { createAsyncThunk } from "@reduxjs/toolkit";
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
import { setError } from "../slices/errorSlice";
import axios from "axios";

export const getCustomers = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/customer/get-all");
    const { data } = res;
    dispatch(setCustomers(data.data));
  } catch (error) {
    dispatch(failure());
    if (axios.isAxiosError(error)) {
      dispatch(setError({
        message: error.response?.data?.message || "Mijozlarni yuklashda xatolik",
        type: 'error'
      }));
    }
  }
};

export const getCustomersDebtor = (filterDate?: string): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const url = filterDate 
      ? `/customer/get-debtor?date=${filterDate}`
      : "/customer/get-debtor";

    const res = await authApi.get(url);
    const { data } = res;

    dispatch(setCustomersDebtor(data.data || []));
  } catch (error) {
    dispatch(failure());
    if (axios.isAxiosError(error)) {
      dispatch(setError({
        message: error.response?.data?.message || "Qarzdorlarni yuklashda xatolik",
        type: 'error'
      }));
    }
  }
};

export const getCustomersPayment = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/customer/get-payment");
    const { data } = res;
    dispatch(setCustomersPatment(data.data));
  } catch (error) {
    dispatch(failure());
    if (axios.isAxiosError(error)) {
      dispatch(setError({
        message: error.response?.data?.message || "To'lovlarni yuklashda xatolik",
        type: 'error'
      }));
    }
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
      } catch (error) {
        dispatch(failure());
        if (axios.isAxiosError(error)) {
          dispatch(setError({
            message: error.response?.data?.message || "Mijoz ma'lumotlarini yuklashda xatolik",
            type: 'error'
          }));
        }
      }
    };


export const getContract = createAsyncThunk(
  "customer/getContract",
  async (customerId: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await authApi.get(`/customer/get-contract-by-id/${customerId}`);
      const { data } = res;

      dispatch(setCustomerContracts(data.data));

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const payDebt = createAsyncThunk(
  "customer/payDebt",
  async (payData: IPaydata, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.post("/payment/pay-debt", payData);
      await dispatch(getContract(payData.customerId)); // Refresh contract data after payment
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const payNewDebt = createAsyncThunk(
  "customer/payNewDebt",
  async (payData: IPaydata, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.post("/payment/pay-new-debt", payData);
      await dispatch(getContract(payData.customerId)); // Refresh contract data after payment
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const payAllRemaining = createAsyncThunk(
  "customer/payAllRemaining",
  async (payData: IPaydata, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.post("/payment/pay-all-remaining", {
        contractId: payData.id,
        amount: payData.amount,
        notes: payData.notes,
        currencyDetails: payData.currencyDetails,
        currencyCourse: payData.currencyCourse,
      });
      await dispatch(getContract(payData.customerId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const postponePayment = createAsyncThunk(
  "customer/postponePayment",
  async (data: {
    contractId: string;
    postponeDate: string;
    reason: string;
    customerId: string;
  }, { dispatch, rejectWithValue }) => {
    try {
      const response = await authApi.post("/payment/postpone-payment", {
        contractId: data.contractId,
        postponeDate: data.postponeDate,
        reason: data.reason,
      });
      await dispatch(getContract(data.customerId));
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
