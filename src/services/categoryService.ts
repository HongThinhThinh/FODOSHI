import { createQueryHook } from "../utils/customHook";

export const useGetCategory = createQueryHook("category", "/category/active");
