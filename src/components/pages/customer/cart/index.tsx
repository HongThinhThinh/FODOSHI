import React, { useEffect, useState, useCallback } from "react";
import "./index.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { remove, changeQuantity } from "../../../../redux/features/cartSlice";

import ButtonComponent from "../../../atoms/button";
import { Link, useNavigate } from "react-router-dom";
import { formatMoney } from "../../../../utils/formatMoney";
import Checkout from "../check-out";
import { useDeleteCart, useGetCart } from "../../../../services/cartService";
import { message } from "antd";
import api from "../../../../config/api";

export default function Cart() {
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(20000);
  const [discount, setDiscount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [openCheckout, setOpenCheckout] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedCartItems, setSelectedCartItems] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user authentication status from Redux
  const user = useSelector((state: RootState) => state.user);
  // Get Redux cart (for non-authenticated users)
  const reduxCartItems = useSelector(
    (state: RootState) => state.cart?.items || []
  );

  // Only fetch API cart data if user is logged in
  const getParams = useGetCart({
    enabled: !!user, // Only enable API call when user is logged in
  });
  const deleteCart = useDeleteCart();

  // Use API cart data for logged in users, Redux cart data for guests
  const cartData = user
    ? getParams?.data?.data?.cartItems || []
    : reduxCartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        product: {
          id: item.id,
          name: item.name,
          size: item.size || "N/A",
          color: item.color || "#ccc",
          sellingPrice: item.price,
          mainImage: item.image,
          imageUrls: item.image ? [{ image: item.image }] : [],
        },
      }));

  const calculateTotals = useCallback(() => {
    // Calculate based on selected items
    let calculatedSubtotal = 0;

    if (cartData && cartData.length > 0 && selectedItems.length > 0) {
      for (const item of cartData) {
        if (item.product && selectedItems.includes(item.product.id)) {
          calculatedSubtotal +=
            (item.product.sellingPrice || 0) * (item.quantity || 1);
        }
      }
    }

    setSubtotal(calculatedSubtotal);
    setGrandTotal(calculatedSubtotal + shippingFee - discount);
  }, [cartData, selectedItems, shippingFee, discount]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckboxChange = (productId, cartItemId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(productId)) {
        // If deselecting an item, also remove from selectedCartItems
        setSelectedCartItems((prev) =>
          prev.filter(
            (id) =>
              !cartData.find(
                (item) => item.product?.id === productId && item.id === id
              )
          )
        );
        return prevSelected.filter((id) => id !== productId);
      } else {
        // If selecting an item, add its cartItemId to selectedCartItems
        const cartItem = cartData.find(
          (item) => item.product?.id === productId
        );
        if (cartItem) {
          setSelectedCartItems((prev) => [...prev, cartItem.id]);
        }
        return [...prevSelected, productId];
      }
    });
  };

  const handleRemoveItem = async (itemId) => {
    try {
      if (user) {
        // Authenticated user: use API
        const response = await api.delete(`/cart/${itemId}`);
        if (response.status === 200) {
          message.success("Xóa sản phẩm thành công!");
          getParams.refetch();
        }
      } else {
        // Guest user: use Redux
        dispatch(remove(itemId));
        message.success("Xóa sản phẩm thành công!");
      }

      // Update selected items
      setSelectedItems((prevSelected) =>
        prevSelected.filter((id) => {
          const item = cartData.find((i) => i.id === itemId);
          return item?.product?.id !== id;
        })
      );

      // Update selected cart items
      setSelectedCartItems((prev) => prev.filter((id) => id !== itemId));

      // Recalculate totals
      calculateTotals();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa sản phẩm.");
      console.error("Error removing item:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]);
      setSelectedCartItems([]);
    } else {
      const allProductIds = cartData
        .filter((item) => item.product && item.product.id)
        .map((item) => item.product.id);
      const allCartItemIds = cartData
        .filter((item) => item.id)
        .map((item) => item.id);
      setSelectedItems(allProductIds);
      setSelectedCartItems(allCartItemIds);
    }
  };

  // Check if all items are selected
  const allSelected =
    cartData.length > 0 &&
    selectedItems.length ===
      cartData.filter((item) => item.product && item.product.id).length;

  return (
    <div className="cart">
      <div className="cart__title">Giỏ hàng</div>
      <div className="cart__items">
        <div className="cart__items__header">
          <span>
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={allSelected && cartData.length > 0}
            />
          </span>
          <span>Sản phẩm</span>
          <span className="cart__items__header__categoryItems">Phân loại</span>
          <span>Giá sản phẩm</span>
          <span></span>
        </div>
        {!cartData || cartData?.length === 0 ? (
          <div className="cart__items__empty">Giỏ hàng trống</div>
        ) : (
          cartData?.map((cartItem) => {
            if (!cartItem || !cartItem?.product) return null;

            const product = cartItem?.product;
            if (!product) return null;

            return (
              <div className="cart__items__item" key={cartItem.id}>
                <div className="cart__items__item__checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product?.id)}
                    onChange={() =>
                      handleCheckboxChange(product?.id, cartItem.id)
                    }
                  />
                </div>
                <div className="cart__items__item__product">
                  <div className="cart__items__item__product__image">
                    {product?.imageUrls && product?.mainImage && (
                      <img
                        src={product?.mainImage || product?.imageUrls[0]?.image}
                        alt={product.name || "Sản phẩm"}
                      />
                    )}
                  </div>
                </div>
                <div className="cart__items__item__category">
                  <div className="cart__items__item__product__details">
                    <div className="cart__items__item__product__details__name">
                      {product?.name || "Không có tên"}
                    </div>
                  </div>
                  <div className="cart__items__item__category__details">
                    <div className="cart__items__item__category__details__container">
                      <span className="cart__items__item__category__details__title">
                        Phân loại :{" "}
                      </span>
                      <span className="cart__items__item__category__details__size">
                        Size {product?.size || "N/A"}
                      </span>
                    </div>

                    <div className="color-display">
                      <span className="cart__items__item__category__details__title">
                        Màu
                      </span>
                      <div
                        className="color-swatch"
                        style={{
                          backgroundColor: product?.color || "#ccc",
                        }}
                        title={product?.color || "Không xác định"}
                      />
                    </div>
                  </div>
                </div>
                <div className="cart__items__item__price">
                  {formatMoney(product?.sellingPrice || 0)}
                </div>
                <div className="cart__items__item__remove">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(cartItem.id)}
                  >
                    <DeleteOutlined />
                  </button>
                </div>
                <div className="cart__items__item__category--mobile">
                  {/* Mobile view content */}
                  {/* ... rest of the component stays the same ... */}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="cart__summary">
        <div className="cart__summary__content">
          <div className="cart__summary__row">
            <span>Tiền hàng</span>
            <span>{formatMoney(subtotal)} VND</span>
          </div>
          <div className="cart__summary__row">
            <span>Phí vận chuyển</span>
            <span>{formatMoney(shippingFee)} VND</span>
          </div>
          <div className="cart__summary__row">
            <span>Voucher giảm giá</span>
            <span>{formatMoney(discount)} VND</span>
          </div>
          <div className="cart__summary__row cart__summary__row--total">
            <span>Tổng thanh toán</span>
            <span>{formatMoney(grandTotal)} VND</span>
          </div>
          <div className="cart__summary__checkout">
            <ButtonComponent
              onClick={() => setOpenCheckout(true)}
              color="#fff"
              bgColor="#8B2E13"
              className="cart__summary__checkout-btn"
              disabled={selectedItems.length === 0}
            >
              Thanh toán
            </ButtonComponent>
          </div>
        </div>
      </div>

      <Checkout
        setOpen={setOpenCheckout}
        open={openCheckout && selectedItems.length > 0}
        grandTotalBeforeShipping={subtotal}
        shippingFee={shippingFee}
        discount={discount}
        grandTotal={grandTotal}
        selectedItems={selectedItems}
        selectedCartItems={selectedCartItems}
      />
    </div>
  );
}
