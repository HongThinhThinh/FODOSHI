import {
  createMutationHook,
  createQueryHook,
  deleteMutationHook,
} from "../utils/customHook";

export const useCreateCart = createMutationHook("cart", "/cart");
export const useGetCart = createQueryHook("cart", "/cart");
export const useDeleteCart = deleteMutationHook("cart", "/cart");
