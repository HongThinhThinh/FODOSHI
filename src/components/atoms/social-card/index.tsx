import "./styles.scss";

interface SocialCardProps {
  content?: string;
  title?: string;
  image?: string;
}

function SocialCard({ content, image, title }: SocialCardProps) {
  return (
    <div className="social-card__container">
      <img className="social-card__image" src={image} alt="" />
      <div className="social-card__wrapper">
        <h6 className="social-card__title">{title}</h6>
        <p className="social-card__content">{content}</p>
      </div>
    </div>
  );
}

export default SocialCard;
