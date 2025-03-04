// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Product } from "../../model/product";
// import { mockClothingProducts } from "../../dummy-data/mockClothingData";

// const initialState = {
//   // products: [] as Product[],
//   products: mockClothingProducts,
// };

// export const cartSlice = createSlice({
//   name: "cart",
//   initialState: initialState,
//   reducers: {
//     add: (state, action: PayloadAction<Product>) => {
//       const index = state.products.findIndex(
//         (product) => product.productId === action.payload.productId
//       );
//       if (index == -1) {
//         state.products.push({ ...action.payload, quantity: 1 });
//       } else {
//         state.products[index].quantity++;
//       }
//     },
//     reset: (state) => {
//       state.products = initialState.products;
//     },
//     remove: (state, action: PayloadAction<number>) => {
//       state.products = state.products.filter(
//         (product) => product.productId !== action.payload
//       );
//     },
//     changeQuantity: (
//       state,
//       action: PayloadAction<{ productId: number; quantity: number }>
//     ) => {
//       const index = state.products.findIndex(
//         (product) => product.productId === action.payload.productId
//       );
//       if (index !== -1) {
//         state.products[index].quantity = action.payload.quantity;
//       }
//     },
//     getAll: (state, action: PayloadAction<Product>) => {
//       state.products = [...state.products, action.payload];
//     },
//   },
// });
// export const { add, reset, remove, changeQuantity, getAll } = cartSlice.actions;
// export default cartSlice.reducer;
