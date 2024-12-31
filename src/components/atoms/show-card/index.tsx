import { ShowCardType } from "../../../assets/contant";
import { formatMoney } from "../../../utils/formatMoney";
import "./styles.scss";
interface showCardProps {
  card: ShowCardType;
  onClick?: () => void;
}

function ShowCard({ card }: showCardProps) {
  return (
    <div className="show-card-container">
      <img className="show-card__img" src={card?.image} alt="" />
      <div className="show-card__wrapper">
        <p className="show-card__name">{card?.name}</p>
        <p className="show-card__type">{card?.type}</p>
        <p className="show-card__size">Size {card?.size}</p>
        <p className="show-card__price">{formatMoney(card?.price)}</p>
      </div>
    </div>
  );
}

export default ShowCard;
