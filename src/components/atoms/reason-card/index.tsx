import "./styles.scss";

interface reasonCardProps {
  content?: string;
  image?: string;
  reverse?: boolean;
}

function ReasonCard({ content, image, reverse }: reasonCardProps) {
  return (
    <div>
      {reverse ? (
        <div className="reason-card__container">
          <img className="reason-card__image ml-[4%]" src={image} alt="" />
          <div className="reason-card__content">
            <p>{content}</p>
          </div>
        </div>
      ) : (
        <div className="reason-card__container">
          <div className="reason-card__content">
            <p>{content}</p>
          </div>
          <img className="reason-card__image mr-[4%]" src={image} alt="" />
        </div>
      )}
    </div>
  );
}

export default ReasonCard;
