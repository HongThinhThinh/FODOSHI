import { createQueryWithPathParamHook } from "../utils/customHook";

export const useGetUserByPhone = createQueryWithPathParamHook(
  "user",
  "/users/phone"
);
