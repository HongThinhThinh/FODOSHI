export type ProductCategory = {
  id: number;
  name: string;
};

export type Product = {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  description: string;
  category: ProductCategory[];
  size: string;
  brand: string;
  image: string;
};
