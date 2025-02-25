import { ShowCardType } from "../../../assets/contant";
import { formatMoney } from "../../../utils/formatMoney";
import { LiaCartPlusSolid } from "react-icons/lia";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
interface showCardProps {
  card: ShowCardType;
  onClick?: () => void;
}

function ShowCard({ card }: showCardProps) {
  const navigate = useNavigate();
  const imageUrl = card?.imageUrls?.length
    ? card.imageUrls[0].image
    : "default-image.jpg";
  return (
    <div
      className="show-card-container"
      onClick={() => navigate(`/product-detail/${card?.id}`)}
    >
      <div className="show-card__image">
        <img className="show-card__image--img" src={imageUrl} alt="" />
        <div className="show-card__image--icon">
          <LiaCartPlusSolid />
        </div>
      </div>
      <div className="show-card__wrapper">
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
