import React, { useEffect, useState, useCallback } from "react";
import "./index.scss";
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getParams = useGetCart();
  const deleteCart = useDeleteCart();
  const cartData = getParams?.data?.data?.cartItems || [];

  const calculateTotals = useCallback(() => {
    // Tính toán dựa trên các mặt hàng được chọn
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

  // useEffect(() => {
  //   if (cartData && cartData.length > 0) {
  //     dispatch(getAll(cartData));
  //   }
  // }, [dispatch, getParams?.data]);

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  const handleCheckboxChange = (productId) => {
    setSelectedItems((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await api.delete(`/cart/${productId}`);
      if (response.status === 200) {
        message.success("Xóa sản phẩm thành công!");
        getParams.refetch();

        dispatch(remove(productId)); // Xóa sản phẩm khỏi giỏ hàng trong Redux

        // Cập nhật lại danh sách sản phẩm đã chọn nếu cần
        setSelectedItems((prevSelected) =>
          prevSelected.filter((id) => id !== productId)
        );
        // Tính toán lại tổng giá trị giỏ hàng nếu cần
        calculateTotals(); // Gọi hàm tính toán lại tổng giỏ hàng nếu cần
      } else {
        //message.error("Có lỗi xảy ra khi xóa sản phẩm.");
      }
    } catch (error) {
      //message.error("Có lỗi xảy ra khi xóa sản phẩm.");
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartData.length) {
      setSelectedItems([]);
    } else {
      const allIds = cartData
        .filter((item) => item.product && item.product.id)
        .map((item) => item.product.id);
      setSelectedItems(allIds);
    }
  };

  // Check if all items are selected (safely handle empty arrays)
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
          <span>Phân loại</span>
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
              <div className="cart__items__item" key={product?.id}>
                <div className="cart__items__item__checkbox">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product?.id)}
                    onChange={() => handleCheckboxChange(product?.id)}
                  />
                </div>
                <div className="cart__items__item__product">
                  <div className="cart__items__item__product__image">
                    {product?.imageUrls && product?.imageUrls[0] && (
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
                  <div>
                    <div>Phân loại</div>
                    <div>Size {product?.size || "N/A"}</div>
                    <div className="color-display">
                      <span>Màu</span>
                      <div
                        className="color-swatch"
                        style={{
                          backgroundColor: product?.color || "#ccc",
                        }}
                        title={product?.color || "Không xác định"} // Tooltip hiển thị tên màu
                      />
                    </div>
                  </div>
                </div>
                <div className="cart__items__item__price">
                  {formatMoney(product?.sellingPrice || 0)} VND
                </div>
                <div className="cart__items__item__remove">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(cartItem.id)}
                  >
                    <DeleteOutlined />
                  </button>
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
      />
    </div>
  );
}
