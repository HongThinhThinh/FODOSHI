import { ArrowUpOutlined, EllipsisOutlined } from "@ant-design/icons";
import "./index.scss";

interface ProductCardProps {
  product: any;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={`product-card item`}>
      <div className="product-card__top">
        <div className="product-card__top--left">
          <img src={product?.mainImage} alt="day la hinh" />
        </div>
        <div className="product-card__top--right">
          <div className="product-name">
            <div>
              <p className="font-medium text-lg">{product?.name}</p>
              <p className="text-gray-500">{product?.category}</p>
            </div>

            <EllipsisOutlined className="more-outlined" />
          </div>
          <b className="text-lg">{product?.price} VND</b>
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
            Đang rao bán
          </div>
        </div>
        <hr />
        <div className="reach">
          <p>Lượt tiếp cận</p>
          <div>
            <p>{product?.reach}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
