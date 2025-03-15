import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define cart item type
interface CartItem {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<CartItem>) => {
      console.log(action);
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index === -1) {
        // Item doesn't exist in cart, add it
        state.items.push(action.payload);
      } else {
        // Item already exists, increment quantity
        state.items[index].quantity += 1;
      }
    },
    remove: (state, action: PayloadAction<string | number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    changeQuantity: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }>
    ) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index].quantity = action.payload.quantity;
      }
    },
    reset: (state) => {
      state.items = [];
    },
    // Add a merge action to handle login scenario
    mergeWithServerCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { add, remove, changeQuantity, reset, mergeWithServerCart } =
  cartSlice.actions;
export default cartSlice.reducer;
