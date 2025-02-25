import { createMutationHook, createQueryHook } from "../utils/customHook";

export const useCreateCart = createMutationHook("cart", "/cart");
export const useGetCart = createQueryHook("cart", "/cart");
