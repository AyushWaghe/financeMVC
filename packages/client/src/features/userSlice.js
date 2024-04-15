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
      console.log("Action payload:", action.payload);

      // Assuming action.payload has the structure { userName, userPassword }
      const { userName, userPassword } = action.payload;

      // Update the user state with the provided data
      state.user = {
        userName,
        userPassword,
        // You can add other user-related properties here if needed
      };
    },
    signup: (state, action) => {
      console.log("Action payload:", action.payload);

      // Assuming action.payload has the structure { userName, userPassword }
      const { userName, userPassword } = action.payload;

      // Update the user state with the provided data
      state.user = {
        userName,
        userPassword,
        // You can add other user-related properties here if needed
      };
    },
    setBillAlertStatus: (state, action) => {
      console.log("Action payload for bill alert",action.payload);
  
      state.billAlertStatus = action.payload.alertStatus;
    },
  },
});

export const { login, signup,setBillAlertStatus } = userSlice.actions;
export const selectUser = (state) => state.user;

export default userSlice.reducer;
