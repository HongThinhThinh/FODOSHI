import { combineReducers } from "@reduxjs/toolkit";

// import { cartSlice } from "./features/cartSlice";
import { userSlice } from "./features/userSlice";

const rootReducer = combineReducers({
  user: userSlice.reducer,
  // cart: cartSlice.reducer,
});

export default rootReducer;
