// import { useDispatch } from "react-redux";
// import { useCallback, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useApiService from "../hooks/useApi";

// const useAuthService = () => {
//   const { callApi, loading, setIsLoading } = useApiService();
//   const router = useNavigate();
//   const dispatch = useDispatch();

//   const register = useCallback(
//     async (values: any) => {
//       try {
//         const response = await callApi("post", "register", {
//           ...values,
//           avt: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
//         });
//         toast.success("Sign Up Successfully, Please Check Your Mail");
//         router.push("/auth/login");
//         return response;
//       } catch (e: any) {
//         toast.error(e?.response?.data || "Registration failed");
//       }
//     },
//     [callApi, router]
//   );

//   const login = useCallback(
//     async (values: any) => {
//       try {
//         const response = await callApi("post", "login", values);
//         localStorage.setItem("token", response?.data?.token);
//         router.push("/");
//         dispatch(loginRedux(response?.data));
//         return response?.data;
//       } catch (e: any) {
//         toast.error(e?.response?.data || "Login failed");
//       }
//     },
//     [callApi, dispatch, router]
//   );

//   const loginGoogle = useCallback(async () => {
//     try {
//       const result = await signInWithPopup(auth, ggProvider);
//       const token = await result.user?.getIdToken();
//       if (token) {
//         const res = await callApi("post", "/login-google", { token });
//         localStorage.setItem("token", res?.data?.token);
//         router.push("/");
//         dispatch(loginRedux(res?.data));
//       }
//     } catch (e: any) {
//       console.error("Error during Google sign-in or API request:", e);
//     }
//   }, [callApi, dispatch, router]);

//   return { register, login, loginGoogle, loading, setIsLoading };
// };

// export default useAuthService;
