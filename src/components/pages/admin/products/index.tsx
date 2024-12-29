import { useState } from "react";
import ProductCard from "../../../atoms/product-card";
import "./index.scss";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id?: string;
  name?: string;
  category?: string;
  price?: number;
  description?: string;
  isForSale?: boolean;
  reach?: number;
  className?: string;
}

function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductCardProps[]>([
    {
      id: "123",
      category: "Áo thun",
      description: "Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "123",
      category: "Áo thun",
      description:
        " Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "123",
      category: "Áo thun",
      description: "Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "123",
      category: "Áo thun",
      description: "Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "123",
      category: "Áo thun",
      description: "Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "123",
      category: "Áo thun",
      description:
        " Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "123",
      category: "Áo thun",
      description: "Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "124",
      category: "Áo thun",
      description: "Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
    {
      id: "125",
      category: "Áo thun",
      description: "Cái áo này trông hay he",
      name: "Messiuuuuu",
      price: 200000,
      reach: 1234,
      isForSale: true,
    },
  ]);

  return (
    <div className="product-page">
      {products.map((product) => (
        <div onClick={() => navigate(`${product.id}`)}>
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
}

export default ProductsPage;
