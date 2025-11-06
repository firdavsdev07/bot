import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ICurrencyDetails } from "../../types/IPayment";

export interface DashboardState {
  dashboard: ICurrencyDetails;
  isLoading: boolean;
}

const initialState: DashboardState = {
  dashboard: {
    dollar: 0,
    sum: 0,
  },
  isLoading: false,
};

const authSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setDashboard(state, action: PayloadAction<ICurrencyDetails>) {
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
