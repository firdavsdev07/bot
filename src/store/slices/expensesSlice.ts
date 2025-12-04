import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { IExpenses } from "../../types/IExpenses";

type ModalType = "add" | "edit" | undefined;

type ModalData = {
  type: ModalType;
  data?: IExpenses | undefined;
};

export interface ExpensesuState {
  activeExpenses: IExpenses[] | [];
  inActiveExpenses: IExpenses[] | [];
  isLoading: boolean;
  expensesModal: ModalData;
}

const initialState: ExpensesuState = {
  activeExpenses: [],
  inActiveExpenses: [],
  isLoading: false,
  expensesModal: { type: undefined, data: undefined },
};

const authSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setActiveExpenses(state, action: PayloadAction<IExpenses[] | []>) {
      state.isLoading = false;
      state.activeExpenses = action.payload;
    },
    setInActiveExpenses(state, action: PayloadAction<IExpenses[] | []>) {
      state.isLoading = false;
      state.inActiveExpenses = action.payload;
    },
    openExpensesModal(state, action: PayloadAction<ModalData>) {
      const data = action.payload;
      state.expensesModal = data;
    },
    closeExpensesModal(state) {
      state.expensesModal = {
        type: undefined,
        data: undefined,
      };
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
  setActiveExpenses,
  setInActiveExpenses,
  openExpensesModal,
  closeExpensesModal,
  start,
  success,
  failure,
} = authSlice.actions;
export default authSlice.reducer;
