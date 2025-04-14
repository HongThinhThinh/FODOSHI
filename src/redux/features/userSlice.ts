import { createSlice } from "@reduxjs/toolkit";
// sau dau : là để khai báo kiểu dữ liệu  ( kiểu null nếu chưa login | kiểu User nếu đã login)
const initialState = null;

export const userSlice = createSlice({
  name: "user",
  initialState, //initialState : initialState, : viết tắt khi tên field và tên biến trùng nhau
  reducers: {
    login: (state, action) => (state = action.payload),
    logout: () => {
      // Clear localStorage when logging out
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLoginGoogle");
      return initialState;
    },
  },
});
export const { login, logout } = userSlice.actions;
export default userSlice;
