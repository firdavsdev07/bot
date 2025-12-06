/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AppThunk } from "../index";
import authApi from "../../server/auth";
import {
  success,
  failure,
  setDashboard,
  start,
} from "../slices/dashboardSlice";
import { setError } from "../slices/errorSlice";
import axios from "axios";

export const getDashboard = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/dashboard");
    const { data } = res;
    dispatch(setDashboard(data.data));
    dispatch(success());
  } catch (error) {
    console.error("❌ Dashboard API Error:", error);
    dispatch(failure());
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios Error Response:", error.response?.data);
      dispatch(setError({ 
        message: error.response?.data?.message || "Dashboard ma'lumotlarini yuklashda xatolik", 
        type: 'error' 
      }));
    }
  }
};

export const getCurrencyCourse = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/dashboard/currency-course");
    const { data } = res;
    dispatch(success());
    return data;
  } catch (error) {
    dispatch(failure());
    if (axios.isAxiosError(error)) {
      dispatch(setError({ 
        message: error.response?.data?.message || "Valyuta kursini yuklashda xatolik", 
        type: 'error' 
      }));
    }
  }
};
