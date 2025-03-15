import { combineReducers } from "@reduxjs/toolkit";
import { userSlice } from "./features/userSlice";
import cartReducer from "./features/cartSlice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  cart: cartReducer,
});

export default rootReducer;
