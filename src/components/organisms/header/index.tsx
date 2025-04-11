import { logo, navbar } from "../../../assets/contant";
import InputComponent from "../../atoms/input";
import Hero from "../../molecules/header-hero";
import SideBarHeader from "../../molecules/sidebar-header";
import { FaSearch } from "react-icons/fa";
import "./styles.scss";
import { HiBars3 } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { Drawer, Divider, Spin, Empty } from "antd";
import { useEffect, useState, useRef } from "react";
import { GrClose } from "react-icons/gr";
import ButtonComponent from "../../atoms/button";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../redux/features/userSlice";
import { toast } from "react-toastify";
import { RootState } from "../../../redux/store";
import UserAvatar from "../../molecules/user-avatar";

interface Product {
  id: number;
  name: string;
  mainImage: string;
  sellingPrice: number;
  deleted: boolean;
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const isBigScreen = useMediaQuery({ query: "(min-width: 1150px)" });
  const user = useSelector((state: RootState) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    toast.success("Logged out");
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch product suggestions
  const fetchSuggestions = async (keyword: string) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://fodoshi.shop/api/products/search?keyword=${encodeURIComponent(
          keyword
        )}`
      );

      if (!response.ok) {
        throw new Error("Không thể tìm kiếm sản phẩm");
      }

      const data = await response.json();
      console.log("Raw search results:", data);

      // Ensure we only show non-deleted products
      const filteredProducts = data.filter(
        (product: Product) => product?.deleted === false
      );

      console.log("Filtered products (deleted=false only):", filteredProducts);

      // Limit to 6 products
      setSuggestions(filteredProducts.slice(0, 6));
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        fetchSuggestions(searchTerm);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchTerm.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleSuggestionClick = (productId: number) => {
    navigate(`/product-detail/${productId}`);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [isBigScreen]);

  return (
    <>
      <header className="fixed inset-0 z-10 bg-white h-fit">
        <div className="header-container">
          {isBigScreen && (
            <div className="header-search-container" ref={searchRef}>
              <div className="search-input-wrapper">
                <InputComponent
                  bgColor="#fff"
                  prefix={<FaSearch className="text-[#852f1f]" />}
                  shape="round"
                  className="header-input"
                  placeholder="Tìm kiếm sản phẩm ..."
                  size="large"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                />
                {showSuggestions && (
                  <div className="search-suggestions">
                    {loading ? (
                      <div className="suggestion-loading">
                        <Spin size="small" />
                        <span>Đang tìm kiếm...</span>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <ul className="suggestion-list">
                        {suggestions.map((product) => (
                          <li
                            key={product.id}
                            className="suggestion-item"
                            onClick={() => handleSuggestionClick(product.id)}
                          >
                            <div className="suggestion-image">
                              <img src={product.mainImage} alt={product.name} />
                            </div>
                            <div className="suggestion-info">
                              <div className="suggestion-name">
                                {product.name}
                              </div>
                              <div className="suggestion-price">
                                {product.sellingPrice.toLocaleString("vi-VN")}{" "}
                                VND
                              </div>
                            </div>
                          </li>
                        ))}
                        <li
                          className="suggestion-view-all"
                          onClick={handleSearchSubmit}
                        >
                          Xem tất cả kết quả
                        </li>
                      </ul>
                    ) : searchTerm ? (
                      <div className="suggestion-empty">
                        <Empty
                          description="Không tìm thấy sản phẩm"
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            className="header-logo"
            style={{
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="" />
          </div>
          {isBigScreen ? (
            <SideBarHeader className="header-sidebar" />
          ) : (
            <nav className="cursor-pointer" onClick={() => setIsOpen(true)}>
              <HiBars3 size={40} />
            </nav>
          )}
        </div>
        {isBigScreen && (
          <nav className="header-hero">
            <Hero />
          </nav>
        )}
      </header>
      <Drawer
        closeIcon={<GrClose />}
        onClose={() => setIsOpen(false)}
        open={isOpen}
      >
        {user && (
          <div className="mb-5">
            <UserAvatar />
            <Divider style={{ margin: "10px 0" }} />
          </div>
        )}
        <div className="mobile-search-container">
          <InputComponent
            bgColor="#fff"
            prefix={<FaSearch className="text-[#852f1f]" />}
            shape="round"
            className="header-input w-full mb-2"
            placeholder="Tìm kiếm sản phẩm ..."
            size="large"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          <ButtonComponent
            className="search-button w-full"
            onClick={handleSearchSubmit}
          >
            Tìm kiếm
          </ButtonComponent>
        </div>
        <ul className="flex flex-col">
          {navbar.map((item, index) => (
            <li className="navbar-item py-4 border-b-2" key={index}>
              <Link
                onClick={() => setIsOpen(false)}
                className="w-full inline-block hover:text-[#852f1f]"
                to={item.path}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
        {user ? (
          <ButtonComponent
            className="mt-7 w-full"
            shape="round"
            bgColor="#852f1f"
            color="white"
            size="large"
            onClick={() => handleLogout()}
          >
            Đăng xuất
          </ButtonComponent>
        ) : (
          <ButtonComponent
            className="mt-7 w-full"
            shape="round"
            bgColor="#852f1f"
            color="white"
            size="large"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </ButtonComponent>
        )}
      </Drawer>
    </>
  );
}

export default Header;
