/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import Carousel from "../../../atoms/carousel";
import { Navigation } from "swiper/modules";
import { showCardModel, showCardModel1 } from "../../../../assets/model";
import ShowCard from "../../../atoms/show-card";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "./styles.scss";
import { FaCaretLeft } from "react-icons/fa";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { FaCaretRight } from "react-icons/fa";
import { formatMoney } from "../../../../utils/formatMoney";
import ButtonComponent from "../../../atoms/button";
import {
  useGetProductAvailable,
  useGetProductDetail,
  useGetProductByCategory,
} from "../../../../services/productService";
import { ColorPicker, message } from "antd";
import { useCreateCart } from "../../../../services/cartService";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import Checkout from "../check-out";
import { useMediaQuery } from "react-responsive";
import ProductCard from "../../../atoms/product-ht";

type Product = {
  id: number;
  name: string;
  description: string;
  brands: {
    id: number;
    name: string;
    isDeleted: boolean;
  }[];
  categories: {
    id: number;
    name: string;
    isDeleted: boolean;
  }[];
  productCondition: string;
  size: string;
  color: string;
  imageUrls: {
    id: number;
    image: string;
  }[];
  tags: string[];
  originalPrice: number;
  sellingPrice: number;
  status: string;
  gender: string;
  reports: any[];
  consignor: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: string;
    createdAt: string;
    cart: any | null;
    reports: any[];
    enabled: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;
    username: string;
    authorities: {
      authority: string;
    }[];
  };
  createdAt: string;
};

const ProductDetails = () => {
  const { id } = useParams();
  const { data: product } = useGetProductDetail(id) as { data?: Product };
  const items =
    product?.imageUrls?.map((img) => ({
      original: img.image,
      thumbnail: img.image,
    })) || [];

  // Get related products by category (using the first category of the current product)
  const firstCategoryId = product?.categories?.[0]?.id;
  const { data: relatedProducts } = useGetProductByCategory(
    firstCategoryId ? firstCategoryId.toString() : null, // Use null instead of undefined
    {
      enabled: !!firstCategoryId, // Only run query when firstCategoryId exists
    }
  );

  // Filter out the current product from related products and limit to a reasonable number
  const filteredRelatedProducts =
    relatedProducts
      ?.filter((item) => item.id.toString() !== id && item.deleted === false)
      ?.slice(0, 8) || [];

  // For responsive design
  const isBigScreen = useMediaQuery({ query: "(min-width: 1150px)" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { mutate } = useCreateCart();
  const handleAddToCart = async () => {
    if (user) {
      // User is logged in, use API
      try {
        mutate(
          { productId: id },
          {
            onSuccess: () => {
              message.success("Thêm giỏ hàng thành công");
            },
            onError: (error: any) => {
              message.error(error?.response?.data);
            },
          }
        );
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      // User is not logged in, use Redux
      try {
        // Add to cart via Redux
        dispatch({
          type: "cart/add",
          payload: {
            id: id,
            name: product.name,
            price: product.sellingPrice,
            image: product.mainImage || product.imageUrls?.[0]?.image || "",
            quantity: 1,
            originalPrice: product.originalPrice,
            color: product.color,
            size: product.size,
          },
        });
        message.success("Thêm giỏ hàng thành công");
      } catch (error) {
        console.error("Error adding to local cart:", error);
        message.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    }
  };
  const { data } = useGetProductAvailable("AVAILABLE");

  const [openCheckout, setOpenCheckout] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [checkoutCartItemId, setCheckoutCartItemId] = useState(null);

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  // Function to handle Buy Now button
  const handleBuyNow = async () => {
    if (user) {
      // User is logged in, use API
      try {
        const response = await mutate(
          { productId: id },
          {
            onSuccess: (data) => {
              // Find the created cart item ID
              const cartItemId = data?.data?.id;
              if (cartItemId) {
                setCheckoutCartItemId(cartItemId);
                setCheckoutItem(product);
                setOpenCheckout(true);
              } else {
                message.error("Không thể tìm thấy sản phẩm trong giỏ hàng");
              }
            },
            onError: (error) => {
              message.error(error?.response?.data);
            },
          }
        ).unwrap();
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    } else {
      // User is not logged in, use Redux
      try {
        // Add to cart via Redux
        dispatch({
          type: "cart/add",
          payload: {
            id: id,
            name: product.name,
            price: product.sellingPrice,
            image: product.mainImage || product.imageUrls?.[0]?.image || "",
            quantity: 1,
            originalPrice: product.originalPrice,
            color: product.color,
            size: product.size,
          },
        });

        // Set the product for checkout
        setCheckoutItem(product);
        setCheckoutCartItemId(id); // Use product ID as cart item ID for guests
        setOpenCheckout(true);
      } catch (error) {
        console.error("Error adding to local cart:", error);
        message.error("Có lỗi xảy ra khi thêm vào giỏ hàng");
      }
    }
  };

  // Function to handle checkout success
  const handleCheckoutSuccess = () => {
    // Clear the checkout item
    setCheckoutItem(null);
    setCheckoutCartItemId(null);
    // Other cleanup as needed
  };

  const [expanded, setExpanded] = useState(false);
  const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
  const descriptionRef = useRef(null);

  // Kiểm tra nếu mô tả đủ dài để hiển thị nút "Xem thêm"
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      setShouldShowReadMore(element.scrollHeight > 100);
    }
  }, [product?.description]);

  return (
    <main className="min-h-screen my-[80px]">
      <section className="product-details-section">
        <div className="backdrop" />
        <div className="product-details__container">
          <div className="product-details__wrapper">
            <div className="product-details__image">
              {items.length > 0 && (
                <ImageGallery
                  renderLeftNav={(onClick) => (
                    <button
                      className="button-next absolute top-[45%] z-10 left-3 p-1 "
                      onClick={onClick}
                    >
                      <FaCaretLeft
                        className="text-white hover:text-[#d99041]"
                        size={30}
                      />
                    </button>
                  )}
                  renderRightNav={(onClick) => (
                    <button
                      className="button-next absolute top-[45%] z-10 right-3 p-1 "
                      onClick={onClick}
                    >
                      <FaCaretRight
                        className="text-white hover:text-[#d99041]"
                        size={30}
                      />
                    </button>
                  )}
                  items={items}
                  thumbnailPosition="left"
                />
              )}
            </div>
            <div className="product-details__info">
              <div>
                <p className="product-details__name">{product?.name}</p>
                {/* <p className="product-details__type">
                {product?.brands?.map((brand) => brand.name).join(", ")}
              </p>
              <p className="product-details__category">
                {product?.categories
                  ?.map((category) => category.name)
                  .join(", ")}
              </p> */}
                <p>
                  Size:{" "}
                  <span className="product-details__size">{product?.size}</span>
                </p>
                <p>
                  Color:{" "}
                  <ColorPicker
                    value={product?.color}
                    disabled
                    className="product-details__color"
                  />
                </p>

                <p className="product-details__price">
                  {formatMoney(product?.sellingPrice)}
                </p>
              </div>
                 <div className="product-description-container">
                <h3 className="product-description-title">Mô tả sản phẩm</h3>
                <div
                  ref={descriptionRef}
                  className={`product-description-content ${
                    expanded ? "expanded" : ""
                  }`}
                >
                  {product?.description ? (
                    parse(product.description.replace(/\n/g, "<br/>"))
                  ) : (
                    <p className="no-description">
                      Chưa có mô tả cho sản phẩm này
                    </p>
                  )}
                </div>

                {shouldShowReadMore && (
                  <button
                    className="read-more-button"
                    onClick={() => setExpanded(!expanded)}
                  >
                    {expanded ? "Thu gọn" : "Xem thêm"}
                  </button>
                )}
              </div>
              <div className="product-details__button flex gap-5">
                <ButtonComponent
                  size="large"
                  bgColor="#d99041"
                  color="white"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </ButtonComponent>
                <ButtonComponent
                  size="large"
                  bgColor="#d99041"
                  color="white"
                  onClick={handleBuyNow}
                >
                  Thanh toán
                </ButtonComponent>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------mayLike------------- */}
      {filteredRelatedProducts.length > 0 && (
        <section className="homepage-mayLike__container">
          <h2 className="homepage-mayLike__title">Bạn có thể thích</h2>
          <div className="homepage-mayLike__wrapper">
            <Carousel
              className="homepage-mayLike__carousel"
              slidesPerView={isBigScreen ? 4 : 1}
              spaceBetween={3}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              modules={[Navigation]}
            >
              {filteredRelatedProducts?.map((item) => (
                <Carousel.Item
                  className="homepage-mayLike__carousel-item"
                  key={item.id}
                >
                  <ProductCard product={item} />
                </Carousel.Item>
              ))}

              <IoIosArrowForward className="swiper-button-next" />
              <IoIosArrowBack className="swiper-button-prev" />
            </Carousel>
          </div>
        </section>
      )}
      {/* Add the Checkout component */}
      {checkoutItem && (
        <Checkout
          open={openCheckout}
          setOpen={setOpenCheckout}
          grandTotalBeforeShipping={checkoutItem.sellingPrice}
          shippingFee={20000} // Default shipping fee
          discount={0}
          grandTotal={checkoutItem.sellingPrice + 20000}
          selectedCartItems={checkoutCartItemId ? [checkoutCartItemId] : []}
          onCheckoutSuccess={handleCheckoutSuccess}
        />
      )}
    </main>
  );
};

export default ProductDetails;
