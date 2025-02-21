import { useState } from "react";
import ProductCard from "../../../atoms/product-card";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { toTitle } from "../../../../utils/formatStr";
import { Button, Flex } from "antd";
import { FiPlusCircle } from "react-icons/fi";

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
  const currentPath = location.pathname.split("/")[2];
  const currentSubPath = location.pathname.split("/")[3];
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
    <>
      <Flex justify="space-between">
        <div>
          <h1 style={{ fontWeight: "600", fontSize: "24px" }}>
            Tất cả sản phẩm
          </h1>
          <h3>
            <Link to="/">Trang chủ</Link>
            {" > "}
            <Link to={`${currentPath}`}>{toTitle(currentPath)}</Link>
            {currentSubPath ? (
              <>
                {" > "}
                <Link to={`categories/${currentSubPath}`}>
                  {toTitle(currentSubPath)}
                </Link>
              </>
            ) : (
              ""
            )}
          </h3>
        </div>
        <div
          style={{
            position: "relative",
          }}
          onClick={() => navigate("/admin/products/products")}
        >
          <Button
            style={{
              background: "#232321",
              color: "#ffffff",
              borderRadius: "8px",
              padding: "20px 20px",
            }}
          >
            <FiPlusCircle color="white" /> Thêm sản phẩm mới
          </Button>
        </div>
      </Flex>

      <div className="product-page">
        {products.map((product) => (
          <div
            style={{
              padding: "15px",
            }}
            onClick={() => navigate(`${product.id}`)}
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductsPage;
