/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AppThunk } from "../index";
import authApi from "../../server/auth";
import {
  failure,
  setActiveExpenses,
  setInActiveExpenses,
  start,
} from "../slices/expensesSlice";
import { IAddExpenses, IUpdateExpenses } from "../../types/IExpenses";

export const getActiveExpenses = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/expenses/get-all?isActive=true");
    const { data } = res;
    dispatch(setActiveExpenses(data));
  } catch (error: any) {
    dispatch(failure());
  }
};

export const getInActiveExpenses = (): AppThunk => async (dispatch) => {
  dispatch(start());
  try {
    const res = await authApi.get("/expenses/get-all?isActive=false");
    const { data } = res;
    dispatch(setInActiveExpenses(data));
  } catch (error: any) {
    dispatch(failure());
  }
};

export const addExpenses =
  (expensesData: IAddExpenses): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.post("/expenses/", expensesData);
      dispatch(getActiveExpenses());
      dispatch(getInActiveExpenses());
    } catch (error: any) {
      dispatch(failure());
    }
  };

export const updateExpenses =
  (expensesData: IUpdateExpenses): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.put("/expenses/", expensesData);
      dispatch(getActiveExpenses());
      dispatch(getInActiveExpenses());
    } catch (error: any) {
      dispatch(failure());
    }
  };

export const returnExpenses =
  (id: string): AppThunk =>
  async (dispatch) => {
    dispatch(start());
    try {
      await authApi.put("/expenses/return", { id });
      dispatch(getActiveExpenses());
      dispatch(getInActiveExpenses());
    } catch (error: any) {
      dispatch(failure());
    }
  };
