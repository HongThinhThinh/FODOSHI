import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import { cartSlice } from "./features/cartSlice";

const rootReducer = combineReducers({
  user: userSlice,
  cart: cartSlice.reducer,
});

export default rootReducer;
