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

export const getDashboard = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/dashboard");
    const { data } = res;
    dispatch(setDashboard(data.data));
  } catch (error: any) {
    dispatch(failure());
  }
};
export const getCurrencyCourse = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/dashboard/currency-course");
    const { data } = res;
    dispatch(success());
    return data;
  } catch (error: any) {
    dispatch(failure());
  }
};
