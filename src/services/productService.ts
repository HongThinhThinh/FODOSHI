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

export const useGetProductAvailable =  createQueryWithPathParamHook(
  "products-available",
  "/products/status"
)
