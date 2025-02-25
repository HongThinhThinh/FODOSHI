import { ArrowUpOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./index.scss";

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

function ProductCard({
  id,
  name,
  image,
  category,
  price,
  description,
  isForSale,
  reach,
}: ProductCardProps) {
  return (
    <div className={`product-card item`}>
      <div className="product-card__top">
        <div className="product-card__top--left">
          <img
            src={
              "https://themeisle.com/blog/wp-content/uploads/2024/06/Online-Image-Optimizer-Test-Image-JPG-Version.jpeg"
            }
            alt="day la hinh"
          />
        </div>
        <div className="product-card__top--right">
          <div className="product-name">
            <div>
              <p className="font-medium text-lg">{name}</p>
              <p className="text-gray-500">{category}</p>
            </div>

            <EllipsisOutlined className="more-outlined" />
          </div>
          <b className="text-lg">{price} VND</b>
        </div>
      </div>
      <div className="product-card__middle">
        <p className="font-medium text-lg">Miêu tả</p>
        <p className="text-gray-500">{description}</p>
      </div>

      <div className="product-card__bottom">
        <div className="condition">
          <p>Tình trạng sản phẩm</p>
          <div>
            <ArrowUpOutlined className="condition--icon" />
            Đang rao bán
          </div>
        </div>
        <hr />
        <div className="reach">
          <p>Lượt tiếp cận</p>
          <div>
            <p>{reach}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
