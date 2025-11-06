import type { Action, ThunkAction } from "@reduxjs/toolkit";

import { configureStore } from "@reduxjs/toolkit";

import customerReducer from "./slices/customerSlice";
import dashboardReducer from "./slices/dashboardSlice";
import notesReducer from "./slices/notesSlice";
import expensesReducer from "./slices/expensesSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    dashboard: dashboardReducer,
    notes: notesReducer,
    expenses: expensesReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
