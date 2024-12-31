import "./index.scss";
import BlogCard, { BlogCardProps } from "../../atoms/blog-card";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Blog() {
  const navigation = useNavigate();
  const [blogs, setBlogs] = useState<BlogCardProps[]>([
    {
      id: "1",
      title: "May biet cai cho gi ve tao???? 1",
      author: "Nguyễn Khánh Tùng 1",
      category: "Danh sach 1",
      created_at: "2 tiếng trước 1",
      image:
        "https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp",
    },
    {
      id: "1",
      title: "May biet cai cho gi ve tao???? 2",
      author: "Nguyễn Khánh Tùng 2",
      category: "Danh sach 2",
      created_at: "2 tiếng trước 2",
      image:
        "https://platinumlist.net/guide/wp-content/uploads/2023/03/IMG-worlds-of-adventure.webp",
    },
    {
      id: "1",
      title: "May biet cai cho gi ve tao???? 3 fffffffffffffffffffffffffffffff",
      author: "Nguyễn Khánh Tùng 3",
      category: "Danh sach 3",
      created_at: "2 tiếng trước 3",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNxFFYy9zjsJZVubV5yvwhAV6EpfS34mHGGg&s",
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
