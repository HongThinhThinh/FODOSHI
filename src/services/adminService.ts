import {
  createQueryWithPathParamHook,
  createQueryHook,
  createMutationHook,
  updateMutationHook,
  deleteMutationHook,
} from "../utils/customHook";

export const useCreateProduct = createMutationHook("product", "/products");

export const useUpdateProduct = updateMutationHook("product", "/products");

export const useDeleteProduct = deleteMutationHook("product", "/products");

export const useGetProducts = createQueryWithPathParamHook(
  "product",
  "/products"
);
export const useGetCategory = createQueryWithPathParamHook(
  "category",
  "/category"
);

export const useGetCreatedProducts = createQueryHook(
  "createdProducts",
  "/products/created"
);
