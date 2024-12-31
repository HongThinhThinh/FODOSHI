import { Product, ProductCategory } from "../model/product";

export const vndRate = 23000;

export const mockClothingCategories: ProductCategory[] = [
  { id: 1, name: "Shirts" },
  { id: 2, name: "Pants" },
  { id: 3, name: "Jackets" },
  { id: 4, name: "Shoes" },
];

export const mockClothingProducts: Product[] = [
  {
    productId: 201,
    productName: "Casual Shirt",
    quantity: 1,
    price: 25 * vndRate,
    description: "A comfortable casual shirt perfect for any occasion.",
    category: [mockClothingCategories[0]],
    size: "M",
    brand: "Brand A",
    image:
      "https://www.uniqlo.com/jp/ja/contents/feature/lifewear-collection/common_24ss/img/t-shirts/w_pickup2_detailProduct1_sp.png",
  },
  {
    productId: 202,
    productName: "Jeans Pants",
    quantity: 2,
    price: 40 * vndRate,
    description: "Durable and stylish jeans for everyday wear.",
    category: [mockClothingCategories[1]],
    size: "L",
    brand: "Brand B",
    image: "https://via.placeholder.com/100?text=Pants",
  },
  {
    productId: 203,
    productName: "Leather Jacket",
    quantity: 1,
    price: 120 * vndRate,
    description: "A premium leather jacket for cold weather.",
    category: [mockClothingCategories[2]],
    size: "XL",
    brand: "Brand C",
    image: "https://via.placeholder.com/100?text=Jacket",
  },
  {
    productId: 204,
    productName: "Running Shoes",
    quantity: 1,
    price: 80 * vndRate,
    description: "Lightweight running shoes for ultimate comfort.",
    category: [mockClothingCategories[3]],
    size: "42",
    brand: "Brand D",
    image: "https://via.placeholder.com/100?text=Shoes",
  },
];
