import {
  createQueryHook,
  createQueryWithPathParamHook,
} from "../utils/customHook";

export const useGetProductDetail = createQueryWithPathParamHook(
  "product",
  "/products"
);
export const useGetProduct = createQueryHook("product", "/products");
export const useGetCategory = createQueryWithPathParamHook(
  "category",
  "/category"
);
export const useGetProductByCategory = createQueryWithPathParamHook(
  "products/by-category",
  "/products/by-category"
);
export const useGetProductAvailable = createQueryWithPathParamHook(
  "products-available",
  "/products/status"
);
