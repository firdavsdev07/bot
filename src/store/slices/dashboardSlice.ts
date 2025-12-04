import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
// import { ICurrencyDetails } from "../../types/IPayment";

export interface IDashboardData {
  balance: {
    dollar: number;
    sum: number;
  };
  today: {
    dollar: number;
    sum: number;
    count: number;
  };
}

export interface DashboardState {
  dashboard: IDashboardData;
  isLoading: boolean;
}

const initialState: DashboardState = {
  dashboard: {
    balance: {
      dollar: 0,
      sum: 0,
    },
    today: {
      dollar: 0,
      sum: 0,
      count: 0,
    },
  },
  isLoading: false,
};

const authSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setDashboard(state, action: PayloadAction<IDashboardData>) {
      state.isLoading = false;
      state.dashboard = action.payload;
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

export const { setDashboard, start, success, failure } = authSlice.actions;
export default authSlice.reducer;
