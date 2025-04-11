import { ArrowUpOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./index.scss";

interface Brand {
  id: number;
  name: string;
  image: string;
  isDeleted: boolean;
}

interface Category {
  id: number;
  name: string;
  image: string;
  isDeleted: boolean;
}

interface ImageUrl {
  id: number;
  image: string;
}

interface Tag {
  id: number;
  tagName: string;
}

interface Consignor {
  id: string;
  image: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  enabled: boolean;
  username: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  brands: Brand[];
  categories: Category[];
  productCondition: string;
  size: string;
  color: string;
  imageUrls: ImageUrl[];
  mainImage: string;
  tags: Tag[];
  originalPrice: number;
  sellingPrice: number;
  status: string;
  gender: string;
  consignor: Consignor;
  createdAt: string;
  deleted: boolean;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={`product-card item`}>
      <div className="product-card__top">
        <div className="product-card__top--left">
          <img src={product?.mainImage} alt={product?.name} />
        </div>
        <div className="product-card__top--right">
          <div className="product-name">
            <div>
              <p className="font-medium text-lg">{product?.name}</p>
              {product?.categories?.map((category) => (
                <p key={category.id} className="text-gray-500">
                  {category?.name}
                </p>
              ))}
            </div>
            <EllipsisOutlined className="more-outlined" />
          </div>
          <b className="text-lg">
            {product?.sellingPrice?.toLocaleString("vi-VN")} VND
          </b>
        </div>
      </div>
      <div className="product-card__middle">
        <p className="font-medium text-lg">Miêu tả</p>
        <p className="text-gray-500">{product?.description}</p>
      </div>

      <div className="product-card__bottom">
        <div className="condition">
          <p>Tình trạng sản phẩm</p>
          <div>
            <ArrowUpOutlined className="condition--icon" />
            {product?.status === "AVAILABLE" ? "Đang rao bán" : "Đã bán"}
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}

export default ProductCard;
