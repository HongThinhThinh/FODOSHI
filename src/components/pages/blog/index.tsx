import "./index.scss";
import BlogCard, { BlogCardProps } from "../../atoms/blog-card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Blog() {
  const navigation = useNavigate();
  const [blogs, setBlogs] = useState<BlogCardProps[]>([
    {
      id: "1",
      title: "Khám phá áo thun Uniqlo mới ra mắt",
      author: "Uniqlo Store",
      category: "Áo thun nam",
      created_at: "1 ngày trước",
      image:
        "https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp", // Hình ảnh không thay đổi
    },
    {
      id: "2",
      title: "Giảm giá cực sốc cho quần jeans Levi's",
      author: "Levi's Official",
      category: "Quần jeans nữ",
      created_at: "3 ngày trước",
      image:
        "https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp", // Hình ảnh không thay đổi
    },
    {
      id: "3",
      title: "Áo khoác Zara - Thiết kế mùa thu 2023",
      author: "Zara Collection",
      category: "Áo khoác mùa thu",
      created_at: "5 ngày trước",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNxFFYy9zjsJZVubV5yvwhAV6EpfS34mHGGg&s", // Hình ảnh không thay đổi
    },
  ]);

  return (
    <div className="blog">
      <div className="blog__top">
        <div className="blog__top navigation">
          <span
            className="home"
            onClick={() => {
              navigation("/");
            }}
          >
            Trang chủ
          </span>
          <span>{">"}</span>
          <span>Blog</span>
        </div>
        <p>Blog</p>
      </div>

      <div className="blog__bottom">
        <div className="bold">Danh sách</div>
        <div className="blog-list">
          {blogs.map((blog) => (
            <BlogCard
              id={blog.id}
              category={blog.category}
              author={blog.author}
              created_at={blog.created_at}
              title={blog.title}
              image={blog.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
