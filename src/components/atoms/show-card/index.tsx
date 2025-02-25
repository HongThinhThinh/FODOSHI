import { ShowCardType } from "../../../assets/contant";
import { formatMoney } from "../../../utils/formatMoney";
import { LiaCartPlusSolid } from "react-icons/lia";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { useCreateCart } from "../../../services/cartService";
import { toast } from "react-toastify";
import { message } from "antd";
interface showCardProps {
  card: ShowCardType;
  onClick?: () => void;
}

function ShowCard({ card }: showCardProps) {
  const navigate = useNavigate();
  const imageUrl = card?.imageUrls?.length
    ? card.imageUrls[0].image
    : "default-image.jpg";
  const { mutate } = useCreateCart();
  const handleAddToCart = async () => {
    try {
      mutate(
        { productId: card.id },
        {
          onSuccess: () => {
            message.success("Thêm giỏ hàng thành công");
          },
          onError: (error) => {
            message.error(error?.response?.data || "cc");
          },
        }
      );
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };
  return (
    <div className="show-card-container">
      <div className="show-card__image">
        <img
          onClick={() => navigate(`/product-detail/${card?.id}`)}
          className="show-card__image--img"
          src={imageUrl}
          alt=""
        />
        <div
          className="show-card__image--icon relative z-50"
          onClick={handleAddToCart}
        >
          <LiaCartPlusSolid />
        </div>
      </div>
      <div
        className="show-card__wrapper"
        onClick={() => navigate(`/product-detail/${card?.id}`)}
      >
        <p className="show-card__name">{card?.name}</p>
        <p className="show-card__type">
          {card?.brands?.map((brand) => brand.name).join(", ")}
        </p>
        <p className="show-card__size">Size {card?.size}</p>
        <p className="show-card__price">{formatMoney(card?.sellingPrice)}</p>
      </div>
    </div>
  );
}

export default ShowCard;
