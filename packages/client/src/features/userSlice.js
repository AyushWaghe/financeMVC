// userSlice.js

import { createSlice } from "@reduxjs/toolkit";



const userSlice = createSlice({
  name: "user",
  initialState: {
    userName: null,
    userPassword: null,
    billAlertStatus:false,
  },
  reducers: {
    login: (state, action) => {
      const { userId } = action.payload;
      state.user = {
        userId
      };
    },
    signup: (state, action) => {
      const { userId } = action.payload;
      // Update the user state with the provided data
      state.user = {
        userId
      };
    },
    setBillAlertStatus: (state, action) => {
      console.log("Action payload for bill alert",action.payload);
  
      state.billAlertStatus = action.payload.alertStatus;
    },
    logout: (state, action) => {
      const { userId } = action.payload;
      state.user = {
        userId
      };
    },
  },
});

export const { login, signup,setBillAlertStatus,logout } = userSlice.actions;
export const selectUser = (state) => state.user;

export default userSlice.reducer;
