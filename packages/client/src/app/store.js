import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
// import { useReducer } from "react";

const store =   configureStore({
    reducer: {
        user:userReducer
    }
});

export default store;