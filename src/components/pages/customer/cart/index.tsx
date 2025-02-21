import React, { useEffect, useState } from "react";
import "./index.scss";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  add,
  changeQuantity,
  getAll,
  remove,
  reset,
} from "../../../../redux/features/cartSlice";
import { Product, ProductCategory } from "../../../../model/product";

import { RootState } from "../../../../redux/store";
import ButtonComponent from "../../../atoms/button";
import { Link, useNavigate } from "react-router-dom";
import { formatMoney } from "../../../../utils/formatMoney";
import Checkout from "../check-out";

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart);
  const [total, setTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tax, setTax] = useState(5);
  const [openCheckout, setOpenCheckout] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleIncrement = (product: Product) => {
    dispatch(
      changeQuantity({
        productId: product.productId,
        quantity: product.quantity + 1,
      })
    );
  };

  const handleDecrement = (product: Product) => {
    if (product.quantity > 1) {
      dispatch(
        changeQuantity({
          productId: product.productId,
          quantity: product.quantity - 1,
        })
      );
    } else {
      dispatch(remove(product.productId));
    }
  };

  useEffect(() => {
    const total: number = cart?.products?.reduce(
      (total: number, product: Product) =>
        total + product.price * product.quantity,
      0
    );

    setTotal(total);
    setGrandTotal(total + total * (tax / 100));
  }, [cart.products]);

  return (
    <div className="cart">
      <div className="cart__title">
        Your Cart ( {cart?.products?.length} items)
      </div>
      <div className="cart__items">
        <div className="cart__items__header">
          <span>Item</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
        </div>
        {cart?.products?.length === 0 ? (
          <div className="cart__items__empty">Cart is empty</div>
        ) : (
          cart?.products?.map((product: Product) => (
            <div className="cart__items__item">
              <div className="cart__items__item__info">
                <div className="cart__items__item__info__image">
                  <img src={product.image} alt="" />
                </div>
                <div className="cart__items__item__info__details">
                  <div className="cart__items__item__info__details__name">
                    {product.productName}
                  </div>
                  <div className="cart__items__item__info__details__description">
                    <div className="cart__items__item__info__details__description__category">
                      {Array.isArray(product?.category) &&
                      product?.category?.length > 0 ? (
                        product.category.map((category: ProductCategory) => (
                          <span key={category.id}>
                            Category : {category.name}
                          </span>
                        ))
                      ) : (
                        <span>No categories available</span>
                      )}
                    </div>
                    <div className="cart__items__item__info__details__description__size">
                      Size : {product.size}
                    </div>
                    <div className="cart__items__item__info__details__description__brand">
                      Brand : {product.brand}
                    </div>
                  </div>
                </div>
              </div>
              <div className="cart__items__item__price">
                {formatMoney(product.price)}
              </div>
              <div className="cart__items__item__quantity">
                <DownCircleOutlined onClick={() => handleDecrement(product)} />
                <span>{product.quantity}</span>
                <UpCircleOutlined onClick={() => handleIncrement(product)} />
              </div>
              <div className="cart__items__item__total">
                {formatMoney(product.quantity * product.price)}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="cart__bills">
        <div className="cart__bills__left"></div>
        <div className="cart__bills__right">
          <div className="cart__bills__right__item">
            <span className="cart__bills__right__item__title">
              Sub total :{" "}
            </span>
            <span>{formatMoney(total)}</span>
          </div>
          <div className="cart__bills__right__item">
            <span className="cart__bills__right__item__title">
              Sales Tax :{" "}
            </span>{" "}
            <span>{tax}%</span>
          </div>
          <div className="cart__bills__right__item">
            <span className="cart__bills__right__item__title">
              Coupon Code :{" "}
            </span>
            <span>
              <Link to={"/"}>Add Coupon</Link>
            </span>
          </div>
          <div id="grand-total" className="cart__bills__right__item">
            <span className="cart__bills__right__item__title">
              Grand total :{" "}
            </span>
            <span id="grand-total-value"> {formatMoney(grandTotal)}</span>
          </div>
        </div>
      </div>
      <div className="cart__actions">
        <div className="cart__actions__left"></div>
        <div className="cart__actions__right">
          <ButtonComponent
            color="#fff"
            status="danger"
            className="cart__actions__button"
            onClick={() => dispatch(reset())}
          >
            Clear Cart
          </ButtonComponent>
          {cart?.products?.length > 0 && (
            <ButtonComponent
              onClick={() => {
                setOpenCheckout(true);
                console.log("Clicked checkout " + openCheckout);
              }}
              color="#fff"
              bgColor="#d99041"
              className="cart__actions__button"
            >
              Checkout
            </ButtonComponent>
          )}
        </div>
      </div>
      <Checkout
        setOpen={setOpenCheckout}
        open={openCheckout && cart?.products?.length > 0}
        grandTotalBeforeShipping={grandTotal}
      />
    </div>
  );
}
