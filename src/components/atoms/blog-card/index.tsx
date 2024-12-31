import "./index.scss";

export interface BlogCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  created_at: string;
  image: string;
}

function BlogCard({
  id = "1",
  title = "May biet cai cho gi ve tao????",
  author = "Nguyễn Khánh Tùng",
  category = "Danh sach",
  created_at = "2 tiếng trước",
  image = "https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp",
}: BlogCardProps) {
  return (
    <div className="card" onClick={() => {}}>
      <div className="card__image">
        <img src={image} alt="" />
      </div>
      <div className="card__information">
        <div className="bold">{category}</div>
        <div className="bold">{title}</div>
        <div>
          <p>By {author}</p>
          <p> {created_at}</p>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
