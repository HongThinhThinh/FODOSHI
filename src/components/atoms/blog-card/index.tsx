import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRightOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./index.scss";

export interface BlogCardProps {
  id: string;
  title: string;
  author: string;
  category: string;
  created_at: string;
  image: string;
  excerpt?: string;
  featured?: boolean;
}

function BlogCard({
  id = "1",
  title = "May biet cai cho gi ve tao????",
  author = "Nguyễn Khánh Tùng",
  category = "Danh sach",
  created_at = "2 tiếng trước",
  image = "https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp",
  excerpt = "Khám phá thêm những điều thú vị về thời trang bền vững và phong cách sống xanh cùng FODOSHI.",
  featured = false,
}: BlogCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to blog detail page and pass the blog ID in the URL
    navigate(`/blog/${id}`);

    // Scroll to top for better UX
    window.scrollTo(0, 0);
  };

  return (
    <div className={`blog-card ${featured ? "featured" : ""}`}>
      <div className="blog-card-image-container" onClick={handleCardClick}>
        <div className="blog-card-image-skeleton"></div>
        <img src={image} alt={title} className="blog-card-image" />
        <div className="blog-card-category">
          <span>{category}</span>
        </div>
      </div>

      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span>
            <UserOutlined /> {author}
          </span>
          <span className="blog-card-meta-separator">•</span>
          <span>
            <ClockCircleOutlined /> {created_at}
          </span>
        </div>

        <h3 className="blog-card-title" onClick={handleCardClick}>
          {title}
        </h3>

        <p className="blog-card-excerpt">{excerpt}</p>

        <div className="blog-card-footer">
          <button className="blog-card-read-more" onClick={handleCardClick}>
            Đọc tiếp <ArrowRightOutlined className="blog-card-arrow-icon" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
