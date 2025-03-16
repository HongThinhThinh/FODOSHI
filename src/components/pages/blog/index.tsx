import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  SearchOutlined,
  FilterOutlined,
  TagOutlined,
} from "@ant-design/icons";
import {
  Input,
  Tabs,
  Tag,
  Breadcrumb,
  Divider,
  Select,
  Pagination,
} from "antd";
import BlogCard, { BlogCardProps } from "../../atoms/blog-card";
import "./index.scss";

const { TabPane } = Tabs;

function Blog() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  // Mock categories - in a real app these would come from an API
  const categories = [
    "Tất cả",
    "Thời trang nam",
    "Thời trang nữ",
    "Phụ kiện",
    "Mẹo chăm sóc",
    "Thời trang bền vững",
    "Xu hướng",
  ];

  // Mock blog data - in a real app these would come from an API
  const [blogs, setBlogs] = useState<BlogCardProps[]>([
    {
      id: "1",
      title: "Thời trang bền vững: Xu hướng thời trang của tương lai",
      author: "Nguyễn Hồng Thịnh",
      category: "Thời trang bền vững",
      created_at: "1 ngày trước",
      image: "https://aglobal.vn/upload/images/9%285%29.jpg",
      excerpt:
        "Khám phá cách thời trang bền vững đang thay đổi cách chúng ta nhìn nhận và tiêu dùng thời trang.",
      featured: true,
    },
    {
      id: "2",
      title: "5 cách phối đồ secondhand cho mùa thu 2023",
      author: "Trần Thị Yến Thi",
      category: "Xu hướng",
      created_at: "3 ngày trước",
      image:
        "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=2064",
      excerpt:
        "Học cách phối những món đồ secondhand thành những outfit trendy và độc đáo cho mùa thu này.",
    },
    {
      id: "3",
      title: "Cách nhận biết chất liệu vải chất lượng cao",
      author: "Bùi Thúy Quỳnh",
      category: "Mẹo chăm sóc",
      created_at: "5 ngày trước",
      image:
        "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2069",
      excerpt:
        "Những mẹo đơn giản giúp bạn nhận biết và lựa chọn quần áo có chất liệu vải tốt.",
    },
    {
      id: "4",
      title: "Mix & Match: Cách kết hợp phụ kiện vintage",
      author: "Đỗ Văn Minh",
      category: "Phụ kiện",
      created_at: "1 tuần trước",
      image:
        "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=2034",
      excerpt:
        "Những bí quyết kết hợp phụ kiện vintage với trang phục hiện đại.",
    },
    {
      id: "5",
      title: "Lịch sử của thời trang quần jeans",
      author: "Phát",
      category: "Thời trang nam",
      created_at: "2 tuần trước",
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2026",
      excerpt:
        "Khám phá hành trình của quần jeans từ trang phục lao động đến biểu tượng thời trang.",
    },
    {
      id: "6",
      title: "Phong cách Y2K và sự trở lại",
      author: "Trí Nguyên",
      category: "Xu hướng",
      created_at: "2 tuần trước",
      image:
        "https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=2065",
      excerpt:
        "Tìm hiểu về sự trở lại của phong cách Y2K và cách kết hợp trong thời trang hiện đại.",
    },
  ]);

  // Filter blogs based on category and search
  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "all" || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchText.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchText.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get featured blog
  const featuredBlog = blogs.find((blog) => blog.featured);

  // Rest of blogs for the grid
  const regularBlogs = featuredBlog
    ? filteredBlogs.filter((blog) => blog.id !== featuredBlog.id)
    : filteredBlogs;

  return (
    <div className="blog-page">
      <div className="blog-page-header">
        <div className="container">
          <Breadcrumb className="blog-breadcrumbs">
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item>Blog</Breadcrumb.Item>
          </Breadcrumb>

          <h1 className="blog-page-title">Blog FODOSHI</h1>
          <p className="blog-page-description">
            Khám phá những bài viết mới nhất về thời trang, phong cách sống và
            bền vững
          </p>
        </div>
      </div>

      <div className="blog-page-content container">
        <div className="blog-filters">
          <Input
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />

          <div className="blog-categories">
            <div className="category-label">
              <TagOutlined /> Danh mục:
            </div>
            <div className="category-tags">
              <Tag
                color={selectedCategory === "all" ? "#d99041" : "default"}
                onClick={() => setSelectedCategory("all")}
              >
                Tất cả
              </Tag>
              {categories.slice(1).map((category, index) => (
                <Tag
                  key={index}
                  color={selectedCategory === category ? "#d99041" : "default"}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Tag>
              ))}
            </div>
          </div>
        </div>

        {featuredBlog && selectedCategory === "all" && !searchText && (
          <section className="featured-post-section">
            <h2 className="section-title">Bài viết nổi bật</h2>
            <BlogCard {...featuredBlog} featured={true} />
          </section>
        )}

        <section className="blog-grid-section">
          <h2 className="section-title">Bài viết mới nhất</h2>
          <div className="blog-grid">
            {regularBlogs.length > 0 ? (
              regularBlogs.map((blog) => (
                <div key={blog.id} className="blog-grid-item">
                  <BlogCard {...blog} />
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>Không tìm thấy bài viết phù hợp</p>
              </div>
            )}
          </div>
        </section>

        <Pagination
          current={currentPage}
          total={10}
          onChange={setCurrentPage}
          className="blog-pagination"
        />
      </div>
    </div>
  );
}

export default Blog;
