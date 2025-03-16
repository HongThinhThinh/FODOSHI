import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Breadcrumb,
  Typography,
  Avatar,
  Tag,
  Divider,
  Skeleton,
  Button,
  Input,
  Form,
  List,
  message,
  Space,
  Card,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  TagOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  InstagramOutlined,
  HeartOutlined,
  HeartFilled,
  MessageOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import BlogCard from "../../atoms/blog-card";
import api from "../../../config/api";
import "./index.scss";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// Mock blog data - in a real app, this would come from an API
const mockBlogData = {
  id: "1",
  title: "Thời trang bền vững: Xu hướng thời trang của tương lai",
  content: `
    <p>Thời trang bền vững đang trở thành một xu hướng quan trọng trong ngành công nghiệp thời trang toàn cầu. Không chỉ là một trào lưu tạm thời, đây là một phong trào có tác động sâu rộng đến cách chúng ta sản xuất, tiêu thụ và nhìn nhận thời trang.</p>

    <h2>Thời trang bền vững là gì?</h2>
    
    <p>Thời trang bền vững (Sustainable Fashion) đề cập đến quần áo, giày dép và phụ kiện được thiết kế, sản xuất, phân phối và sử dụng theo cách thân thiện với môi trường và có trách nhiệm xã hội. Điều này bao gồm:</p>
    
    <ul>
      <li>Sử dụng vật liệu thân thiện với môi trường</li>
      <li>Giảm thiểu chất thải và ô nhiễm</li>
      <li>Đảm bảo điều kiện làm việc công bằng và an toàn</li>
      <li>Tạo ra sản phẩm có độ bền cao</li>
      <li>Thiết kế với tư duy về chu kỳ sống của sản phẩm</li>
    </ul>
    
    <h2>Tại sao thời trang bền vững lại quan trọng?</h2>
    
    <p>Ngành công nghiệp thời trang là một trong những ngành gây ô nhiễm lớn nhất trên thế giới. Theo số liệu từ Liên Hợp Quốc, ngành thời trang tạo ra 10% lượng khí thải carbon toàn cầu và là ngành sử dụng nước lớn thứ hai. Mỗi năm, hàng triệu tấn quần áo bị vứt bỏ và chôn lấp.</p>
    
    <p>Thời trang bền vững không chỉ giúp bảo vệ môi trường mà còn đảm bảo quyền lợi của người lao động trong ngành công nghiệp này. Đây là một cách để các thương hiệu và người tiêu dùng có thể cùng nhau tạo ra một tương lai tốt đẹp hơn.</p>
    
    <h2>Làm thế nào để hướng tới thời trang bền vững?</h2>
    
    <p>Có nhiều cách để chúng ta có thể hướng tới thời trang bền vững:</p>
    
    <h3>Đối với người tiêu dùng:</h3>
    
    <ol>
      <li><strong>Mua ít đi, chọn tốt hơn</strong>: Tập trung vào chất lượng thay vì số lượng. Đầu tư vào những món đồ có thể sử dụng lâu dài.</li>
      <li><strong>Tìm hiểu về thương hiệu</strong>: Hãy nghiên cứu về các thương hiệu và phương pháp sản xuất của họ.</li>
      <li><strong>Mua sắm thời trang vintage hoặc secondhand</strong>: Kéo dài vòng đời của quần áo và giảm nhu cầu sản xuất mới.</li>
      <li><strong>Chăm sóc quần áo đúng cách</strong>: Điều này giúp quần áo bền lâu hơn.</li>
      <li><strong>Tái chế và tái sử dụng</strong>: Khi không còn sử dụng, hãy quyên góp hoặc tái chế quần áo.</li>
    </ol>
    
    <h3>Đối với thương hiệu:</h3>
    
    <ol>
      <li><strong>Sử dụng vật liệu bền vững</strong>: Ví dụ như cotton hữu cơ, polyester tái chế, lụa hòa bình.</li>
      <li><strong>Đảm bảo điều kiện làm việc công bằng</strong>: Trả lương công bằng và đảm bảo an toàn cho người lao động.</li>
      <li><strong>Giảm thiểu chất thải</strong>: Áp dụng các phương pháp sản xuất không phế thải.</li>
      <li><strong>Thiết kế có trách nhiệm</strong>: Tạo ra các sản phẩm có tính bền vững cao và dễ tái chế.</li>
    </ol>
    
    <p>Thời trang bền vững không phải là một xu hướng nhất thời mà là một hướng đi lâu dài cần được chúng ta hỗ trợ và phát triển. Mỗi hành động nhỏ đều có thể tạo ra sự khác biệt lớn đối với môi trường và tương lai của ngành công nghiệp thời trang.</p>
  `,
  author: {
    name: "Nguyễn Văn A",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Chuyên gia thời trang bền vững với hơn 10 năm kinh nghiệm trong ngành công nghiệp thời trang. Tốt nghiệp Đại học Thời trang London và hiện là cố vấn cho nhiều thương hiệu bền vững tại Việt Nam.",
  },
  category: "Thời trang bền vững",
  createdAt: "2023-10-15T08:30:00Z",
  updatedAt: "2023-10-16T10:15:00Z",
  image:
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070",
  tags: [
    "Thời trang bền vững",
    "Eco-friendly",
    "Thời trang xanh",
    "Sustainable",
  ],
  likes: 87,
  comments: [
    {
      id: "c1",
      author: "Trần Thị B",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      content:
        "Bài viết rất hay và bổ ích! Tôi đã bắt đầu áp dụng một số tips để mua sắm bền vững hơn.",
      datetime: "2023-10-16T14:22:00Z",
      likes: 5,
      replies: [],
    },
    {
      id: "c2",
      author: "Lê Văn C",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      content:
        "Tôi rất quan tâm đến chủ đề này. Các bạn có thể giới thiệu một số thương hiệu thời trang bền vững ở Việt Nam không?",
      datetime: "2023-10-17T09:15:00Z",
      likes: 3,
      replies: [
        {
          id: "r1",
          author: "Nguyễn Văn A",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          content:
            "Cảm ơn bạn đã quan tâm! Một số thương hiệu Việt Nam có thể kể đến như VIET TIEN, CANIFA, và một số brand nhỏ như MUTAN, CHULA,...",
          datetime: "2023-10-17T10:30:00Z",
          likes: 2,
        },
      ],
    },
  ],
  relatedPosts: [
    {
      id: "2",
      title: "5 cách phối đồ secondhand cho mùa thu 2023",
      author: "Trần Thị B",
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
      author: "Lê Văn C",
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
      author: "Phạm Thị D",
      category: "Phụ kiện",
      created_at: "1 tuần trước",
      image:
        "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=2034",
      excerpt:
        "Những bí quyết kết hợp phụ kiện vintage với trang phục hiện đại.",
    },
  ],
  nextPost: {
    id: "2",
    title: "5 cách phối đồ secondhand cho mùa thu 2023",
  },
  prevPost: {
    id: "5",
    title: "Lịch sử của thời trang quần jeans",
  },
};

// Replace Comment component with a custom CommentItem component
const CommentItem = ({
  author,
  avatar,
  content,
  datetime,
  actions,
  children,
}) => {
  return (
    <div className="custom-comment">
      <div className="custom-comment-content">
        <div className="custom-comment-avatar">
          <Avatar src={avatar} alt={author} />
        </div>

        <div className="custom-comment-body">
          <div className="custom-comment-header">
            <span className="custom-comment-author">{author}</span>
            <span className="custom-comment-datetime">{datetime}</span>
          </div>

          <div className="custom-comment-text">
            <p>{content}</p>
          </div>

          {actions && <div className="custom-comment-actions">{actions}</div>}
        </div>
      </div>

      {children && <div className="custom-comment-children">{children}</div>}
    </div>
  );
};

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [blogData, setBlogData] = useState<any>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const getBlogDataById = (id: string) => {
    // Create a mapping of complete blog posts with unique content
    const blogPosts = {
      "1": {
        id: "1",
        title: "Thời trang bền vững: Xu hướng thời trang của tương lai",
        content: `
          <p>Thời trang bền vững đang trở thành một xu hướng quan trọng trong ngành công nghiệp thời trang toàn cầu. Không chỉ là một trào lưu tạm thời, đây là một phong trào có tác động sâu rộng đến cách chúng ta sản xuất, tiêu thụ và nhìn nhận thời trang.</p>
  
          <h2>Thời trang bền vững là gì?</h2>
          
          <p>Thời trang bền vững (Sustainable Fashion) đề cập đến quần áo, giày dép và phụ kiện được thiết kế, sản xuất, phân phối và sử dụng theo cách thân thiện với môi trường và có trách nhiệm xã hội. Điều này bao gồm:</p>
          
          <ul>
            <li>Sử dụng vật liệu thân thiện với môi trường</li>
            <li>Giảm thiểu chất thải và ô nhiễm</li>
            <li>Đảm bảo điều kiện làm việc công bằng và an toàn</li>
            <li>Tạo ra sản phẩm có độ bền cao</li>
            <li>Thiết kế với tư duy về chu kỳ sống của sản phẩm</li>
          </ul>
          
          <h2>Tại sao thời trang bền vững lại quan trọng?</h2>
          
          <p>Ngành công nghiệp thời trang là một trong những ngành gây ô nhiễm lớn nhất trên thế giới. Theo số liệu từ Liên Hợp Quốc, ngành thời trang tạo ra 10% lượng khí thải carbon toàn cầu và là ngành sử dụng nước lớn thứ hai. Mỗi năm, hàng triệu tấn quần áo bị vứt bỏ và chôn lấp.</p>
          
          <p>Thời trang bền vững không chỉ giúp bảo vệ môi trường mà còn đảm bảo quyền lợi của người lao động trong ngành công nghiệp này. Đây là một cách để các thương hiệu và người tiêu dùng có thể cùng nhau tạo ra một tương lai tốt đẹp hơn.</p>
  
          <h2>Làm thế nào để hướng tới thời trang bền vững?</h2>
          
          <p>Có nhiều cách để chúng ta có thể hướng tới thời trang bền vững:</p>
          
          <h3>Đối với người tiêu dùng:</h3>
          
          <ol>
            <li><strong>Mua ít đi, chọn tốt hơn</strong>: Tập trung vào chất lượng thay vì số lượng. Đầu tư vào những món đồ có thể sử dụng lâu dài.</li>
            <li><strong>Tìm hiểu về thương hiệu</strong>: Hãy nghiên cứu về các thương hiệu và phương pháp sản xuất của họ.</li>
            <li><strong>Mua sắm thời trang vintage hoặc secondhand</strong>: Kéo dài vòng đời của quần áo và giảm nhu cầu sản xuất mới.</li>
            <li><strong>Chăm sóc quần áo đúng cách</strong>: Điều này giúp quần áo bền lâu hơn.</li>
            <li><strong>Tái chế và tái sử dụng</strong>: Khi không còn sử dụng, hãy quyên góp hoặc tái chế quần áo.</li>
          </ol>
          
          <h3>Đối với thương hiệu:</h3>
          
          <ol>
            <li><strong>Sử dụng vật liệu bền vững</strong>: Ví dụ như cotton hữu cơ, polyester tái chế, lụa hòa bình.</li>
            <li><strong>Đảm bảo điều kiện làm việc công bằng</strong>: Trả lương công bằng và đảm bảo an toàn cho người lao động.</li>
            <li><strong>Giảm thiểu chất thải</strong>: Áp dụng các phương pháp sản xuất không phế thải.</li>
            <li><strong>Thiết kế có trách nhiệm</strong>: Tạo ra các sản phẩm có tính bền vững cao và dễ tái chế.</li>
          </ol>
          
          <p>Thời trang bền vững không phải là một xu hướng nhất thời mà là một hướng đi lâu dài cần được chúng ta hỗ trợ và phát triển. Mỗi hành động nhỏ đều có thể tạo ra sự khác biệt lớn đối với môi trường và tương lai của ngành công nghiệp thời trang.</p>
        `,
        author: {
          name: "Nguyễn Văn A",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          bio: "Chuyên gia thời trang bền vững với hơn 10 năm kinh nghiệm trong ngành công nghiệp thời trang. Tốt nghiệp Đại học Thời trang London và hiện là cố vấn cho nhiều thương hiệu bền vững tại Việt Nam.",
        },
        category: "Thời trang bền vững",
        createdAt: "2023-10-15T08:30:00Z",
        updatedAt: "2023-10-16T10:15:00Z",
        image: "https://aglobal.vn/upload/images/9%285%29.jpg",
        tags: [
          "Thời trang bền vững",
          "Eco-friendly",
          "Thời trang xanh",
          "Sustainable",
        ],
        likes: 87,
        comments: [
          {
            id: "c1",
            author: "Trần Thị B",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            content:
              "Bài viết rất hay và bổ ích! Tôi đã bắt đầu áp dụng một số tips để mua sắm bền vững hơn.",
            datetime: "2023-10-16T14:22:00Z",
            likes: 5,
            replies: [],
          },
        ],
        nextPost: {
          id: "2",
          title: "5 cách phối đồ secondhand cho mùa thu 2023",
        },
        prevPost: {
          id: "5",
          title: "Lịch sử của thời trang quần jeans",
        },
        relatedPosts: [
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
        ],
      },

      "2": {
        id: "2",
        title: "5 cách phối đồ secondhand cho mùa thu 2023",
        content: `
          <p>Phối đồ secondhand đang là xu hướng được nhiều người yêu thời trang hướng đến. Không chỉ tiết kiệm chi phí, việc mua sắm và phối đồ secondhand còn góp phần bảo vệ môi trường và tạo nên phong cách riêng biệt. Dưới đây là 5 cách phối đồ secondhand cho mùa thu 2023 mà bạn có thể tham khảo.</p>
  
          <h2>1. Layer áo len vintage với áo sơ mi</h2>
          
          <p>Mùa thu là thời điểm hoàn hảo để thực hiện kỹ thuật layer đồ. Bạn có thể mặc một chiếc áo sơ mi secondhand bên trong và khoác ngoài một chiếc áo len vintage. Sự kết hợp này vừa giữ ấm vừa tạo nên vẻ ngoài thời thượng.</p>
          
          <p>Gợi ý: Chọn áo len có màu trung tính như be, nâu, xám để dễ dàng kết hợp với các màu áo sơ mi khác nhau.</p>
          
          <h2>2. Mix quần jeans cổ điển với áo blazer oversize</h2>
          
          <p>Quần jeans từ những thập niên 80-90 thường có form dáng đặc trưng và chất vải denim dày, bền. Kết hợp với một chiếc áo blazer oversize secondhand sẽ tạo nên set đồ vừa thanh lịch vừa có nét bụi bặm, cá tính.</p>
          
          <h2>3. Kết hợp váy midi vintage với boots cao cổ</h2>
          
          <p>Váy midi vintage thường có họa tiết và form dáng đặc trưng của thời kỳ trước. Phối cùng một đôi boots cao cổ sẽ tạo nên vẻ ngoài cân bằng giữa nữ tính và mạnh mẽ, rất phù hợp với không khí mùa thu.</p>
          
          <h2>4. Áo khoác da secondhand với items basic</h2>
          
          <p>Một chiếc áo khoác da secondhand có tuổi đời sẽ mang đến vẻ đẹp vintage không thể có được ở những sản phẩm mới. Kết hợp với những món đồ basic như áo thun trắng, quần jeans đen để tạo nên set đồ cá tính nhưng không kém phần thanh lịch.</p>
          
          <h2>5. Phụ kiện vintage cho outfit hiện đại</h2>
          
          <p>Đôi khi, chỉ cần thêm một vài phụ kiện secondhand như khăn quàng cổ vintage, túi xách retro hay thắt lưng cổ điển cũng đủ làm mới hoàn toàn một outfit quen thuộc.</p>
          
          <p>Những cách phối đồ secondhand trên không chỉ giúp bạn tiết kiệm chi phí mà còn góp phần tạo nên phong cách thời trang độc đáo, khó trùng lặp. Hãy mạnh dạn khám phá những cửa hàng đồ secondhand và tìm kiếm những món đồ phù hợp với phong cách của bản thân nhé!</p>
        `,
        author: {
          name: "Trần Thị Yến Thi",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg",
          bio: "Fashion blogger với hơn 5 năm kinh nghiệm trong lĩnh vực thời trang secondhand và vintage. Sở hữu tủ quần áo 80% là đồ secondhand và là người sáng lập dự án 'Mặc lại yêu thương'.",
        },
        category: "Xu hướng",
        createdAt: "2023-10-22T10:15:00Z",
        updatedAt: "2023-10-22T15:30:00Z",
        image:
          "https://images.unsplash.com/photo-1566206091558-7f218b696731?q=80&w=2064",
        tags: [
          "Secondhand",
          "Vintage",
          "Phối đồ",
          "Mùa thu",
          "Thời trang bền vững",
        ],
        likes: 64,
        comments: [
          {
            id: "c1",
            author: "Minh Anh",
            avatar: "https://randomuser.me/api/portraits/women/22.jpg",
            content:
              "Tôi rất thích ý tưởng phối áo len vintage với sơ mi. Sẽ thử ngay cuối tuần này!",
            datetime: "2023-10-22T16:45:00Z",
            likes: 3,
            replies: [],
          },
          {
            id: "c2",
            author: "Hoàng Nam",
            avatar: "https://randomuser.me/api/portraits/men/33.jpg",
            content:
              "Bạn có thể gợi ý một vài địa chỉ mua đồ secondhand uy tín ở Hà Nội không?",
            datetime: "2023-10-23T08:22:00Z",
            likes: 2,
            replies: [
              {
                id: "r1",
                author: "Trần Thị Yến Thi",
                avatar: "https://randomuser.me/api/portraits/women/65.jpg",
                content:
                  "Chào bạn, ở Hà Nội có thể ghé các shop như Think Twice, Flamingo Vintage, Kho Tàng Vintage hoặc chợ đồ si Hàng Da nhé!",
                datetime: "2023-10-23T10:15:00Z",
                likes: 4,
              },
            ],
          },
        ],
        nextPost: {
          id: "3",
          title: "Cách nhận biết chất liệu vải chất lượng cao",
        },
        prevPost: {
          id: "1",
          title: "Thời trang bền vững: Xu hướng thời trang của tương lai",
        },
        relatedPosts: [
          {
            id: "1",
            title: "Thời trang bền vững: Xu hướng thời trang của tương lai",
            author: "Nguyễn Văn A",
            category: "Thời trang bền vững",
            created_at: "1 ngày trước",
            image: "https://aglobal.vn/upload/images/9%285%29.jpg",
            excerpt:
              "Khám phá cách thời trang bền vững đang thay đổi cách chúng ta nhìn nhận và tiêu dùng thời trang.",
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
        ],
      },

      "3": {
        id: "3",
        title: "Cách nhận biết chất liệu vải chất lượng cao",
        content: `
          <p>Khi mua sắm quần áo, việc biết cách nhận biết chất liệu vải chất lượng cao là một kỹ năng vô cùng hữu ích. Không chỉ giúp bạn tiết kiệm tiền bạc trong dài hạn, nó còn giúp bạn xây dựng một tủ đồ bền vững và thân thiện với môi trường.</p>
  
          <h2>1. Kiểm tra kết cấu vải</h2>
          
          <p>Chất liệu vải chất lượng cao thường có kết cấu dày dặn, mịn màng và đều đặn. Khi sờ vào, bạn sẽ cảm nhận được độ chắc chắn nhưng vẫn mềm mại. Hãy giữ vải trước ánh sáng - nếu bạn thấy cấu trúc dệt không đều hoặc quá thưa, đây có thể là dấu hiệu của vải chất lượng thấp.</p>
          
          <h2>2. Kiểm tra độ đàn hồi</h2>
          
          <p>Kéo nhẹ vải và quan sát xem nó có trở về hình dạng ban đầu không. Vải chất lượng tốt sẽ có khả năng đàn hồi tốt và ít nhăn nhúm. Nếu vải bị giãn hoặc biến dạng sau khi kéo, đây là dấu hiệu cho thấy chất lượng kém.</p>
          
          <h2>3. Đọc thành phần vải</h2>
          
          <p>Hãy chú ý đến nhãn thành phần vải. Các chất liệu tự nhiên như cotton, linen, lụa và len thường có chất lượng tốt và độ bền cao hơn so với các chất liệu tổng hợp giá rẻ. Tuy nhiên, một số hỗn hợp vải với tỷ lệ thích hợp giữa tự nhiên và tổng hợp cũng có thể mang lại hiệu suất tốt.</p>
          
          <h2>4. Kiểm tra đường may</h2>
          
          <p>Đường may của quần áo chất lượng cao thường thẳng, đều và chắc chắn. Không có chỉ thừa, đường may không bị nhăn hoặc có khoảng hở. Các chi tiết như nút áo, khóa kéo cũng nên được gắn chắc chắn và hoạt động trơn tru.</p>
  
          <h2>5. Kiểm tra xử lý hoàn thiện</h2>
          
          <p>Các sản phẩm chất lượng cao thường có xử lý hoàn thiện tốt như viền trong sạch sẽ, không có chỉ thừa, và các chi tiết được hoàn thiện cẩn thận. Kiểm tra cả mặt trong của quần áo để đánh giá chất lượng tổng thể.</p>
          
          <h2>6. Thực hiện kiểm tra chà xát</h2>
          
          <p>Chà nhẹ vải giữa các ngón tay hoặc lên một bề mặt trắng. Nếu có nhiều xơ vải hoặc màu rơi ra, đó là dấu hiệu của vải chất lượng kém hoặc nhuộm không tốt.</p>
          
          <p>Cuối cùng, hãy nhớ rằng giá cả không phải lúc nào cũng phản ánh chất lượng. Với những kiến thức cơ bản trên, bạn có thể tìm được những món đồ chất lượng tốt mà không cần phải chi quá nhiều tiền. Việc đầu tư vào những món đồ có chất lượng vải tốt sẽ giúp bạn tiết kiệm trong dài hạn và góp phần bảo vệ môi trường.</p>
        `,
        author: {
          name: "Bùi Thúy Quỳnh",
          avatar: "https://randomuser.me/api/portraits/women/79.jpg",
          bio: "Nhà thiết kế thời trang với 15 năm kinh nghiệm làm việc với các loại vải và chất liệu cao cấp. Chuyên gia tư vấn chất liệu cho nhiều thương hiệu nội địa và quốc tế.",
        },
        category: "Mẹo chăm sóc",
        createdAt: "2023-10-19T14:30:00Z",
        updatedAt: "2023-10-20T09:15:00Z",
        image:
          "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2069",
        tags: [
          "Chất liệu vải",
          "Mẹo mua sắm",
          "Thời trang bền vững",
          "Chăm sóc quần áo",
        ],
        likes: 92,
        comments: [
          {
            id: "c1",
            author: "Ngọc Linh",
            avatar: "https://randomuser.me/api/portraits/women/89.jpg",
            content:
              "Cảm ơn chị về những chia sẻ hữu ích. Em đã mua nhầm rất nhiều đồ kém chất lượng trước đây.",
            datetime: "2023-10-19T17:22:00Z",
            likes: 7,
            replies: [],
          },
          {
            id: "c2",
            author: "Quang Minh",
            avatar: "https://randomuser.me/api/portraits/men/52.jpg",
            content:
              "Chị có thể chia sẻ thêm về cách phân biệt cotton thật và cotton pha polyester không ạ?",
            datetime: "2023-10-20T08:45:00Z",
            likes: 5,
            replies: [
              {
                id: "r1",
                author: "Bùi Thúy Quỳnh",
                avatar: "https://randomuser.me/api/portraits/women/79.jpg",
                content:
                  "Chào bạn, để phân biệt cotton thật và cotton pha, bạn có thể dùng test đốt: cotton thật khi đốt sẽ cháy hết và có mùi như giấy cháy, tro mịn; còn polyester khi đốt sẽ chảy nhựa và có mùi hóa chất. Hoặc nhỏ nước lên vải - cotton thật thấm nước nhanh, còn vải pha thấm chậm hơn.",
                datetime: "2023-10-20T10:30:00Z",
                likes: 9,
              },
            ],
          },
        ],
        nextPost: {
          id: "4",
          title: "Mix & Match: Cách kết hợp phụ kiện vintage",
        },
        prevPost: {
          id: "2",
          title: "5 cách phối đồ secondhand cho mùa thu 2023",
        },
        relatedPosts: [
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
        ],
      },
      "4": {
        id: "4",
        title: "Mix & Match: Cách kết hợp phụ kiện vintage",
        content: `
        <p>Phụ kiện vintage luôn có sức hút đặc biệt bởi tính độc đáo và câu chuyện lịch sử đằng sau mỗi món đồ. Việc kết hợp những phụ kiện cổ điển này với trang phục hiện đại không chỉ giúp bạn tạo nên phong cách riêng biệt mà còn mang đến sự phá cách thú vị cho outfit hàng ngày.</p>

        <h2>Vì sao nên chọn phụ kiện vintage?</h2>
        
        <p>Phụ kiện vintage có nhiều điểm hấp dẫn so với các sản phẩm mới. Đầu tiên, chúng thường được làm thủ công với chất liệu cao cấp và độ hoàn thiện tỉ mỉ mà khó tìm thấy trong các sản phẩm sản xuất hàng loạt hiện nay. Thứ hai, mỗi món đồ vintage đều có câu chuyện và lịch sử riêng, tạo nên giá trị tinh thần không thể đo đếm được. Cuối cùng, việc sử dụng phụ kiện vintage cũng là một cách góp phần bảo vệ môi trường thông qua việc tái sử dụng.</p>
        
        <h2>1. Kết hợp túi xách vintage với trang phục tối giản</h2>
        
        <p>Một chiếc túi xách vintage - dù là túi vải thập niên 70, túi da từ những năm 80, hay túi cầm tay kiểu retro - đều có thể trở thành điểm nhấn tuyệt vời cho outfit đơn giản. Hãy chọn trang phục với tông màu trung tính và thiết kế tối giản để chiếc túi vintage của bạn thực sự tỏa sáng.</p>
        
        <p>Mẹo phối đồ: Với một chiếc áo thun trắng, quần jeans xanh đậm và một đôi giày sneaker trắng, hãy thêm vào một chiếc túi crossbody vintage bằng da nâu để tạo nên vẻ ngoài vừa hiện đại vừa hoài cổ.</p>
        
        <h2>2. Biến hóa với các loại khăn vintage</h2>
        
        <p>Khăn lụa, khăn quàng cổ vintage có họa tiết đặc trưng thường rất bắt mắt và linh hoạt trong cách sử dụng. Bạn có thể quàng quanh cổ theo kiểu truyền thống, buộc vào tay cầm túi xách, làm băng đô, thắt làm dây lưng mảnh, hoặc thậm chí biến chúng thành áo crop-top trong những ngày hè.</p>
        
        <h2>3. Trang sức vintage - điểm nhấn tinh tế</h2>
        
        <p>Trang sức vintage thường có thiết kế độc đáo và mang đậm dấu ấn của thời đại. Một chiếc brooch (ghim cài áo) từ thập niên 50, đôi bông tai đính đá từ những năm 60, hay vòng cổ chunky từ thời kỳ 80s đều có thể làm nổi bật trang phục hiện đại của bạn.</p>
        
        <p>Lưu ý: Không nên sử dụng quá nhiều món trang sức vintage cùng lúc. Chọn 1-2 món làm điểm nhấn là đủ để tạo ấn tượng mà không bị rối mắt.</p>
        
        <h2>4. Kính mát vintage - vũ khí thời trang mạnh mẽ</h2>
        
        <p>Kính mát vintage từ những thương hiệu nổi tiếng như Ray-Ban, Persol hay Polaroid không chỉ bảo vệ mắt mà còn là phụ kiện thời trang cực kỳ hiệu quả. Kiểu dáng cat-eye, aviator hay wayfarer đều có thể mang đến vẻ ngoài sang trọng và bí ẩn cho người đeo.</p>
        
        <h2>5. Đồng hồ cổ điển - nét thanh lịch vượt thời gian</h2>
        
        <p>Một chiếc đồng hồ vintage với dây da hoặc dây kim loại mỏng là món phụ kiện tinh tế cho cả nam và nữ. Những chiếc đồng hồ này không chỉ cho biết thời gian mà còn kể câu chuyện về lịch sử, văn hóa và kỹ thuật chế tác đồng hồ qua các thời kỳ.</p>
        
        <p>Cách bảo quản: Đồng hồ vintage cần được bảo quản cẩn thận, tránh nước và va đập. Nên mang đến các cửa hàng chuyên nghiệp để bảo dưỡng định kỳ.</p>
        
        <h2>Kết luận</h2>
        
        <p>Phụ kiện vintage không chỉ là những món đồ thời trang, chúng còn là những mảnh ghép của lịch sử và văn hóa. Việc kết hợp chúng một cách khéo léo với trang phục hiện đại sẽ giúp bạn tạo nên phong cách độc đáo và cá tính riêng. Hãy nhớ, quy tắc quan trọng nhất là "ít nhưng chất" - chỉ cần một vài món phụ kiện vintage được lựa chọn cẩn thận là đủ để làm nổi bật cả outfit.</p>
      `,
        author: {
          name: "Đỗ Văn Minh",
          avatar: "https://randomuser.me/api/portraits/men/75.jpg",
          bio: "Stylist với hơn 8 năm kinh nghiệm trong ngành thời trang, chuyên về phối đồ và phụ kiện vintage. Đồng sáng lập cửa hàng 'Old's Cool Vintage' tại Sài Gòn và thường xuyên tổ chức workshop về cách phối phụ kiện vintage.",
        },
        category: "Phụ kiện",
        createdAt: "2023-10-18T09:45:00Z",
        updatedAt: "2023-10-18T14:20:00Z",
        image:
          "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?q=80&w=2034",
        tags: [
          "Phụ kiện",
          "Vintage",
          "Mix & Match",
          "Thời trang bền vững",
          "Secondhand",
        ],
        likes: 78,
        comments: [
          {
            id: "c1",
            author: "Thanh Hà",
            avatar: "https://randomuser.me/api/portraits/women/62.jpg",
            content:
              "Tôi vừa tìm được một chiếc túi vintage từ thập niên 80 ở chợ đồ cũ. Cảm ơn bài viết, giờ tôi biết phải phối nó thế nào rồi!",
            datetime: "2023-10-18T16:20:00Z",
            likes: 4,
            replies: [],
          },
          {
            id: "c2",
            author: "Quốc Bảo",
            avatar: "https://randomuser.me/api/portraits/men/41.jpg",
            content:
              "Bạn có thể giới thiệu một số cửa hàng đồng hồ vintage uy tín không? Tôi đang tìm một chiếc đồng hồ cơ từ những năm 60-70.",
            datetime: "2023-10-19T08:35:00Z",
            likes: 2,
            replies: [
              {
                id: "r1",
                author: "Đỗ Văn Minh",
                avatar: "https://randomuser.me/api/portraits/men/75.jpg",
                content:
                  "Chào bạn, ở Việt Nam bạn có thể tham khảo các cửa hàng như Vintage Watch Vietnam, The Old Timepiece hay Passionate Watch. Nếu mua online thì Chrono24 có nhiều sản phẩm tốt, nhưng nhớ kiểm tra kỹ người bán và đánh giá trước khi mua nhé!",
                datetime: "2023-10-19T10:15:00Z",
                likes: 5,
              },
            ],
          },
        ],
        nextPost: {
          id: "5",
          title: "Lịch sử của thời trang quần jeans",
        },
        prevPost: {
          id: "3",
          title: "Cách nhận biết chất liệu vải chất lượng cao",
        },
        relatedPosts: [
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
        ],
      },
      "5": {
        id: "5",
        title: "Lịch sử của thời trang quần jeans",
        content: `
        <p>Quần jeans - món đồ không thể thiếu trong tủ quần áo của hầu hết mọi người trên toàn thế giới. Từ công nhân đến người mẫu, từ nông dân đến ngôi sao nhạc rock, tất cả đều yêu thích chiếc quần với chất liệu denim bền bỉ này. Nhưng bạn có bao giờ tự hỏi về nguồn gốc và hành trình phát triển của quần jeans?</p>

        <h2>Sự ra đời của quần jeans</h2>
        
        <p>Lịch sử của quần jeans bắt đầu từ thế kỷ 19, khi Levi Strauss, một thương nhân người Đức nhập cư sang Mỹ, bắt đầu bán vải cotton thô (denim) cho những người thợ mỏ tìm vàng ở California. Vào năm 1873, Strauss hợp tác với Jacob Davis, một thợ may, để sáng tạo ra chiếc quần lao động với đinh tán gia cố ở các điểm dễ rách. Họ đã được cấp bằng sáng chế cho thiết kế này, đánh dấu sự ra đời chính thức của quần jeans hiện đại.</p>
        
        <h2>Từ quần áo lao động đến biểu tượng văn hóa</h2>
        
        <p>Ban đầu, quần jeans chỉ được sử dụng bởi công nhân, nông dân và thợ mỏ vì độ bền cao và khả năng chịu đựng tốt trong môi trường lao động nặng nhọc. Tuy nhiên, đến những năm 1930-1940, jeans bắt đầu xuất hiện trong các bộ phim cao bồi (Western) của Hollywood, biến nó thành biểu tượng của sự mạnh mẽ, độc lập và tinh thần khai phá phương Tây.</p>
        
        <p>Bước ngoặt quan trọng đến vào những năm 1950, khi các ngôi sao điện ảnh như Marlon Brando trong "The Wild One" (1953) và James Dean trong "Rebel Without a Cause" (1955) đưa quần jeans lên màn ảnh, biến nó thành biểu tượng của sự nổi loạn và tinh thần thanh niên. Từ đó, jeans dần dần trở thành trang phục phổ biến trong giới trẻ và văn hóa đại chúng.</p>
        
        <h2>Sự phát triển qua các thập kỷ</h2>
        
        <p>Mỗi thập kỷ đều chứng kiến sự tiến hóa của quần jeans với những phong cách đặc trưng:</p>
        
        <h3>Thập niên 60-70: Hippie và Flare</h3>
        
        <p>Thời kỳ này chứng kiến sự xuất hiện của quần jeans ống loe (flare jeans) và quần ống vẩy (bell-bottoms), gắn liền với phong trào hippie và văn hóa phản chiến. Jeans bắt đầu được trang trí với hoa văn, vá, thêu và các chi tiết thủ công khác.</p>
        
        <h3>Thập niên 80: Designer Jeans</h3>
        
        <p>Đây là thời kỳ bùng nổ của "designer jeans" với sự xuất hiện của các thương hiệu cao cấp như Calvin Klein, Guess, và Jordache. Phong cách acid wash và stonewashed jeans trở nên phổ biến, cùng với quần jeans skinny và ống đứng.</p>
        
        <h3>Thập niên 90: Grunge và Baggy</h3>
        
        <p>Phong cách grunge đưa đến sự trở lại của quần jeans rách, trong khi hip-hop popularized quần baggy jeans. Thời kỳ này cũng chứng kiến sự phát triển của quần jeans thấp eo (low-rise jeans).</p>
        
        <h3>Thập niên 2000: Premium Denim</h3>
        
        <p>Xu hướng jeans cao cấp nở rộ với các thương hiệu như 7 For All Mankind, True Religion và Citizens of Humanity. Skinny jeans trở thành xu hướng chủ đạo, đặc biệt là sau năm 2005.</p>
        
        <h3>Thập niên 2010-2020: Đa dạng phong cách</h3>
        
        <p>Giai đoạn này chứng kiến sự trở lại của nhiều phong cách retro như mom jeans, boyfriend jeans, và gần đây là quần jeans ống rộng (wide-leg jeans). Sự phát triển của công nghệ dệt may cũng mang đến những loại jeans thoải mái hơn với khả năng co giãn tốt.</p>
        
        <h2>Tác động môi trường và tương lai bền vững</h2>
        
        <p>Mặc dù phổ biến, nhưng sản xuất jeans có tác động đáng kể đến môi trường. Việc trồng bông, nhuộm vải và xử lý denim tiêu tốn rất nhiều nước và thường sử dụng hóa chất độc hại. Hiện nay, nhiều thương hiệu đang nỗ lực phát triển các phương pháp sản xuất jeans bền vững hơn, sử dụng bông hữu cơ, công nghệ nhuộm tiết kiệm nước và tái chế denim.</p>
        
        <p>Trong tương lai, xu hướng jeans bền vững dự kiến sẽ tiếp tục phát triển, cùng với sự quay trở lại của nhiều phong cách vintage và thủ công. Quần jeans, với lịch sử phong phú và khả năng thích ứng, chắc chắn sẽ tiếp tục là một biểu tượng thời trang không bao giờ lỗi thời.</p>
      `,
        author: {
          name: "Phạm Minh Phát",
          avatar: "https://randomuser.me/api/portraits/men/85.jpg",
          bio: "Nhà sử học thời trang và chuyên gia denim với hơn 12 năm nghiên cứu về lịch sử quần jeans. Tác giả của cuốn sách 'Denim: Từ công trường đến sàn catwalk' và là giảng viên khách mời tại nhiều trường thiết kế thời trang.",
        },
        category: "Thời trang nam",
        createdAt: "2023-10-10T11:20:00Z",
        updatedAt: "2023-10-11T09:35:00Z",
        image:
          "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=2026",
        tags: [
          "Quần jeans",
          "Denim",
          "Lịch sử thời trang",
          "Thời trang nam",
          "Vintage",
        ],
        likes: 105,
        comments: [
          {
            id: "c1",
            author: "Hoàng Tuấn",
            avatar: "https://randomuser.me/api/portraits/men/22.jpg",
            content:
              "Bài viết rất hay và chi tiết. Tôi không ngờ lịch sử quần jeans lại phong phú đến vậy!",
            datetime: "2023-10-10T18:15:00Z",
            likes: 8,
            replies: [],
          },
          {
            id: "c2",
            author: "Minh Trí",
            avatar: "https://randomuser.me/api/portraits/men/36.jpg",
            content:
              "Tôi vẫn thích quần jeans ống suông từ thập niên 90. Bạn nghĩ sao về xu hướng Y2K đang quay trở lại?",
            datetime: "2023-10-11T10:25:00Z",
            likes: 3,
            replies: [
              {
                id: "r1",
                author: "Phạm Minh Phát",
                avatar: "https://randomuser.me/api/portraits/men/85.jpg",
                content:
                  "Xu hướng Y2K quay trở lại là một hiện tượng thú vị! Tôi nghĩ đây là một phần của chu kỳ thời trang 20 năm, khi những người trẻ hiện nay bị cuốn hút bởi thẩm mỹ của thời kỳ họ sinh ra nhưng chưa đủ tuổi để trải nghiệm. Jeans ống suông thập niên 90 vẫn rất cool và có vẻ sẽ tiếp tục phổ biến song song với các phong cách Y2K.",
                datetime: "2023-10-11T14:10:00Z",
                likes: 7,
              },
            ],
          },
          {
            id: "c3",
            author: "Thanh Hương",
            avatar: "https://randomuser.me/api/portraits/women/48.jpg",
            content:
              "Bạn có thể chia sẻ thêm về cách bảo quản quần jeans để giữ màu và form dáng được không? Tôi có vài chiếc jeans vintage rất quý.",
            datetime: "2023-10-12T09:40:00Z",
            likes: 10,
            replies: [
              {
                id: "r2",
                author: "Phạm Minh Phát",
                avatar: "https://randomuser.me/api/portraits/men/85.jpg",
                content:
                  "Để bảo quản jeans vintage, hãy giặt ít nhất có thể (hoặc đông lạnh để diệt khuẩn thay vì giặt), giặt ngược mặt trong nước lạnh, tránh máy sấy, và treo thẳng để khô. Khi cất, nên gấp thay vì treo để tránh căng dãn. Với jeans raw denim, nhiều người còn tránh giặt trong 6 tháng đầu để có được những nếp gấp và sự phai màu tự nhiên đẹp hơn!",
                datetime: "2023-10-12T11:25:00Z",
                likes: 12,
              },
            ],
          },
        ],
        nextPost: {
          id: "6",
          title: "Phong cách Y2K và sự trở lại",
        },
        prevPost: {
          id: "4",
          title: "Mix & Match: Cách kết hợp phụ kiện vintage",
        },
        relatedPosts: [
          {
            id: "3",
            title: "Cách nhận biết chất liệu vải chất lượng cao",
            author: "Bùi Thúy Quỳnh",
            category: "Mẹo chăm sóc",
            created_at: "1 tuần trước",
            image:
              "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2069",
            excerpt:
              "Những mẹo đơn giản giúp bạn nhận biết và lựa chọn quần áo có chất liệu vải tốt.",
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
        ],
      },
    };

    // Add this line to return the blog post with the matching ID
    return blogPosts[id] || null;
  };

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      // In a real app, you'd fetch from your API
      // const response = await api.get(`/blogs/${id}`);
      // setBlogData(response.data);

      // Using mock data based on ID for demonstration
      setTimeout(() => {
        setBlogData(getBlogDataById(id));
        setLoading(false);
        // Scroll to top
        window.scrollTo(0, 0);
      }, 800);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      message.error("Không thể tải bài viết. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogDetail();
    }
  }, [id]); // Thêm id vào dependency array

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, you'd send this to your API
    // api.post(`/blogs/${id}/like`);
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      message.warning("Vui lòng nhập nội dung bình luận");
      return;
    }

    setSubmitting(true);

    // In a real app, you'd post this to your API
    // api.post(`/blogs/${id}/comments`, { content: comment });

    setTimeout(() => {
      setSubmitting(false);
      setComment("");
      message.success("Bình luận của bạn đã được đăng thành công!");

      // Update comment list (mock)
      const newComment = {
        id: `c${Date.now()}`,
        author: "Khách hàng",
        avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
        content: comment,
        datetime: new Date().toISOString(),
        likes: 0,
        replies: [],
      };

      setBlogData({
        ...blogData,
        comments: [newComment, ...blogData.comments],
      });
    }, 1000);
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-content container">
          <Skeleton active paragraph={{ rows: 1 }} />
          <Skeleton.Image className="featured-image-skeleton" active />
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    );
  }

  if (!blogData) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-content container">
          <div className="blog-not-found">
            <Title level={2}>Không tìm thấy bài viết</Title>
            <Paragraph>Bài viết không tồn tại hoặc đã bị xóa.</Paragraph>
            <Button type="primary">
              <Link to="/blog">Quay lại Blog</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <div className="container">
          <Breadcrumb className="blog-breadcrumbs">
            <Breadcrumb.Item href="/">
              <HomeOutlined /> Trang chủ
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/blog">Blog</Breadcrumb.Item>
            <Breadcrumb.Item>{blogData.category}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>

      <div className="blog-detail-content container">
        <article className="blog-article">
          <header className="blog-article-header">
            <Title level={1} className="blog-title">
              {blogData.title}
            </Title>

            <div className="blog-meta">
              <div className="blog-meta-left">
                <Avatar
                  src={blogData.author.avatar}
                  size={40}
                  icon={<UserOutlined />}
                />
                <div className="blog-meta-info">
                  <Text className="blog-meta-author">
                    {blogData.author.name}
                  </Text>
                  <div className="blog-meta-details">
                    <span className="blog-meta-date">
                      <ClockCircleOutlined /> {formatDate(blogData.createdAt)}
                    </span>
                    <span className="blog-meta-category">
                      <TagOutlined /> {blogData.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="blog-meta-right">
                <div className="blog-social-share">
                  <Button shape="circle" icon={<FacebookOutlined />} />
                  <Button shape="circle" icon={<TwitterOutlined />} />
                  <Button shape="circle" icon={<LinkedinOutlined />} />
                  <Button shape="circle" icon={<InstagramOutlined />} />
                </div>
              </div>
            </div>
          </header>

          <div className="featured-image-container">
            <img
              src={blogData.image}
              alt={blogData.title}
              className="featured-image"
            />
          </div>

          <div className="blog-content">
            <div
              dangerouslySetInnerHTML={{ __html: blogData.content }}
              className="blog-content-html"
            />
          </div>

          <footer className="blog-article-footer">
            <div className="blog-tags">
              <span className="tags-label">Tags:</span>
              {blogData.tags.map((tag: string, index: number) => (
                <Tag key={index} color="#d99041">
                  <Link to={`/blog/tag/${tag}`}>{tag}</Link>
                </Tag>
              ))}
            </div>

            <div className="blog-actions">
              <Button
                icon={isLiked ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleLike}
                className={isLiked ? "liked" : ""}
              >
                Thích ({isLiked ? blogData.likes + 1 : blogData.likes})
              </Button>

              <Button
                icon={<MessageOutlined />}
                onClick={() =>
                  document
                    .getElementById("comments-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Bình luận ({blogData.comments.length})
              </Button>
            </div>
          </footer>
        </article>

        <Divider />

        <section className="blog-author-section">
          <div className="blog-author-bio">
            <Avatar
              src={blogData.author.avatar}
              size={80}
              icon={<UserOutlined />}
            />
            <div className="blog-author-info">
              <Title level={4} className="blog-author-name">
                {blogData.author.name}
              </Title>
              <Paragraph className="blog-author-description">
                {blogData.author.bio}
              </Paragraph>
              <div className="blog-author-social">
                <Button shape="circle" icon={<FacebookOutlined />} />
                <Button shape="circle" icon={<TwitterOutlined />} />
                <Button shape="circle" icon={<InstagramOutlined />} />
              </div>
            </div>
          </div>
        </section>

        <section className="blog-navigation">
          <div className="blog-nav-links">
            {blogData.prevPost && (
              <Link
                to={`/blog/${blogData.prevPost.id}`}
                className="blog-nav-prev"
              >
                <ArrowLeftOutlined />
                <div>
                  <span className="nav-label">Bài trước</span>
                  <span className="nav-title">{blogData.prevPost.title}</span>
                </div>
              </Link>
            )}

            {blogData.nextPost && (
              <Link
                to={`/blog/${blogData.nextPost.id}`}
                className="blog-nav-next"
              >
                <div>
                  <span className="nav-label">Bài tiếp theo</span>
                  <span className="nav-title">{blogData.nextPost.title}</span>
                </div>
                <ArrowRightOutlined />
              </Link>
            )}
          </div>
        </section>

        <section id="comments-section" className="blog-comments-section">
          <Title level={3} className="section-title">
            Bình luận ({blogData.comments.length})
          </Title>

          <div className="blog-comment-form">
            <Form>
              <Form.Item>
                <TextArea
                  rows={4}
                  placeholder="Viết bình luận của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleCommentSubmit}
                  loading={submitting}
                >
                  Đăng bình luận
                </Button>
              </Form.Item>
            </Form>
          </div>

          <List
            className="comment-list"
            itemLayout="horizontal"
            dataSource={blogData.comments}
            renderItem={(comment) => (
              <li className="comment-item">
                <CommentItem
                  author={comment.author}
                  avatar={comment.avatar}
                  content={comment.content}
                  datetime={formatDate(comment.datetime)}
                  actions={[
                    <Button type="link" key="reply">
                      Trả lời
                    </Button>,
                    <Button type="link" key="like" icon={<LikeOutlined />}>
                      {comment.likes}
                    </Button>,
                  ]}
                >
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map((reply) => (
                        <CommentItem
                          key={reply.id}
                          author={reply.author}
                          avatar={reply.avatar}
                          content={reply.content}
                          datetime={formatDate(reply.datetime)}
                          actions={[
                            <Button type="link" key="reply">
                              Trả lời
                            </Button>,
                            <Button
                              type="link"
                              key="like"
                              icon={<LikeOutlined />}
                            >
                              {reply.likes}
                            </Button>,
                          ]}
                        />
                      ))}
                    </div>
                  )}
                </CommentItem>
              </li>
            )}
          />
        </section>

        <section className="related-posts-section">
          <Title level={3} className="section-title">
            Bài viết liên quan
          </Title>

          <div className="related-posts-grid">
            {blogData.relatedPosts.map((post: any) => (
              <div key={post.id} className="related-post-item">
                <BlogCard {...post} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogDetail;
