import "./styles.scss";
import { useMediaQuery } from "react-responsive";
interface reasonCardProps {
  content?: string;
  image?: string;
  reverse?: boolean;
}

function ReasonCard({ content, image, reverse }: reasonCardProps) {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1150px)" });
  return (
    <div>
      {reverse && isBigScreen ? (
        <div className="reason-card__container">
          <img
            className={`reason-card__image ${isBigScreen ? "ml-[4%]" : ""} `}
            src={image}
            alt=""
          />
          <div className="reason-card__content">
            <p>{content}</p>
          </div>
        </div>
      ) : (
        <div className="reason-card__container">
          <div className="reason-card__content">
            <p>{content}</p>
          </div>
          <img
            className={`reason-card__image ${isBigScreen ? "mr-[4%]" : ""}`}
            src={image}
            alt=""
          />
        </div>
      )}
    </div>
  );
}

export default ReasonCard;
