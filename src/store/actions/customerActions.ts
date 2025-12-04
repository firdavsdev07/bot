/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// The AppThunk type definition might need to be adjusted depending on how createAsyncThunk is used.
// For now, we'll keep the existing AppThunk definition and ensure createAsyncThunk returns properly.

// ===============================================
// Existing Actions (keeping for context, but should be converted to createAsyncThunk too if they also need .unwrap())
// ===============================================

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

export const getCustomersDebtor = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/customer/get-debtor");
    const { data } = res;
    dispatch(setCustomersDebtor(data.data));
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
      // console.log("🔍 getCustomer action called with ID:", id);
      dispatch(start());
      try {
        console.log("📡 Fetching customer details from API...");
        const res = await authApi.get(`/customer/get-by-id/${id}`);
        const { data } = res;
        // console.log("✅ Customer API response:", data);
        // console.log("📊 Customer data:", data.data);
        dispatch(setCustomerDetails(data.data));
      } catch (error) {
        console.error("❌ Error fetching customer:", error);
        dispatch(failure());
        if (axios.isAxiosError(error)) {
          console.error("❌ Error response:", error.response?.data);
          dispatch(setError({ 
            message: error.response?.data?.message || "Mijoz ma'lumotlarini yuklashda xatolik", 
            type: 'error' 
          }));
        }
      }
    };

// ===============================================
// Refactored Payment Actions using createAsyncThunk
// ===============================================

export const getContract = createAsyncThunk(
  "customer/getContract",
  async (customerId: string, { dispatch, rejectWithValue }) => {
    try {
      // console.log("🔍 getContract action - Fetching contracts for customer:", customerId);
      const res = await authApi.get(`/customer/get-contract-by-id/${customerId}`);
      const { data } = res;

      console.log("📦 getContract action - API Response:", data);
      console.log("📋 getContract action - Contracts data:", {
        hasData: !!data.data,
        allContractsCount: data.data?.allContracts?.length,
        debtorContractsCount: data.data?.debtorContracts?.length,
        paidContractsCount: data.data?.paidContracts?.length,
      });

      // This dispatch call is for the slice, not for another thunk from AppThunk
      dispatch(setCustomerContracts(data.data));

      return data.data;
    } catch (error: any) {
      console.error("❌ getContract action - Error:", error);
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
      // Assuming payData.id is the contractId here
      const response = await authApi.post("/payment/pay-all-remaining", {
        contractId: payData.id,
        amount: payData.amount,
        notes: payData.notes,
        currencyDetails: payData.currencyDetails,
        currencyCourse: payData.currencyCourse,
      });
      await dispatch(getContract(payData.customerId)); // Refresh contract data after payment
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
