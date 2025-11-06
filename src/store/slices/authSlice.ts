import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";
import { IProfile } from "../../types/profile";

export interface AuthState {
  user: IProfile;
}

const initialState: AuthState = {
  user: {
    id: "",
    firstname: "",
    lastname: "",
    phoneNumber: "",
    telegramId: "",
    role: null,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(
      state,
      action: PayloadAction<{ profile: IProfile; token: string }>
    ) {
      state.user = action.payload.profile;
      sessionStorage.setItem("accessToken", action?.payload.token);
    },
  },
});

export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;
