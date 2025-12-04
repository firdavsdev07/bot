import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ErrorState {
  message: string | null;
  type: 'error' | 'warning' | 'info' | 'success' | null;
  duration?: number;
}

const initialState: ErrorState = {
  message: null,
  type: null,
  duration: 3000,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<{ 
      message: string; 
      type: 'error' | 'warning' | 'info' | 'success';
      duration?: number;
    }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.duration = action.payload.duration || 3000;
    },
    clearError: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
