import React, { useEffect, useState } from "react";
import "./index.scss";
import { logo } from "../../../../assets/contant";
import ButtonComponent from "../../../atoms/button";
import { ShippingVoucher } from "../../../../model/shippingVoucher";
import { shippingVouchers } from "../../../../dummy-data/mockShippingVoucherData";
import { Modal } from "antd";
import { CloseCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { formatMoney } from "../../../../utils/formatMoney";
import ConfirmModal from "../../../molecules/confirm-modal";

export interface CheckoutProps {
  open?: boolean;
  setOpen: (isOpen: boolean) => void;
  grandTotalBeforeShipping: number;
}

export default function Checkout({ grandTotalBeforeShipping, open, setOpen }: CheckoutProps) {
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedVoucher, setSelectedVoucher] = useState<ShippingVoucher | null>(null);
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(grandTotalBeforeShipping);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const closeCheckout = () => {
    setOpen(false);
  };

  const shippingMethods = [
    {
      id: "GiaoHangTanNoi",
      label: "Giao hàng tận nơi",
      value: "Giao hàng tận nơi",
      img: "https://cdn-icons-png.flaticon.com/512/2897/2897832.png",
    },
    {
      id: "NhanHangTaiCuaHang",
      label: "Nhận hàng tại cửa hàng",
      value: "Nhận hàng tại cửa hàng",
      img: "https://cdn-icons-png.flaticon.com/512/126/126122.png",
    },
  ];
  const paymentMethods = [
    {
      id: "momo",
      label: "Momo Wallet",
      value: "Momo Wallet",
      img: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    },
    {
      id: "credit-card",
      label: "Credit Card",
      value: "Credit Card",
      img: "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
    },
    {
      id: "vnpay",
      label: "VNPay",
      value: "VNPay",
      img: "https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/company_logos/cong-ty-cp-giai-phap-thanh-toan-viet-nam-vnpay-6194ba1fa3d66.jpg",
    },
    {
      id: "cod",
      label: "COD (thanh toán khi nhận hàng)",
      value: "COD",
      img: "https://cdn0.iconfinder.com/data/icons/business-and-finance-outline-icons/50/Business-icons-06-512.png",
    },
  ];

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handlePaymentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPayment(event.target.value);
  };
  const handleShippingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedShipping(event.target.value);
    if (value === "Giao hàng tận nơi") {
      setShippingCost(grandTotalBeforeShipping * 0.1);
    } else {
      setShippingCost(0);
    }
  };
  const handleSelectVoucher = (voucher: ShippingVoucher) => {
    setSelectedVoucher(voucher);
    closeModal();
  };

  useEffect(() => {
    setGrandTotal(
      grandTotalBeforeShipping +
        shippingCost -
        (shippingCost * (selectedVoucher?.discount || 0)) / 100
    );
  }, [grandTotalBeforeShipping, shippingCost, selectedVoucher]);

  return (
    <>
      <div
        className={`checkout__overlay${open ? " checkout__overlay--visible" : ""}`}
        onClick={() => {
          closeCheckout();
          setOpenConfirmModal(false);
        }}
      ></div>

      <div className={`checkout${open ? " checkout--open" : ""}`}>
        <div className="checkout__header">
          <img src={logo} alt="" />
          <div className="checkout__header__close">
            <CloseOutlined onClick={closeCheckout} />
          </div>
        </div>
        <div className="checkout__content">
          <div className="checkout__address">
            <div className="checkout__address__title">Địa chỉ giao hàng</div>
            <div className="checkout__address__items">
              <div className="checkout__address__items__item">Address 1</div>
              <div className="checkout__address__items__item">Address 2</div>
              <div className="checkout__address__items__item">Thêm địa chỉ ....</div>
            </div>
          </div>
          <div className="checkout__payment">
            <div className="checkout__payment__title">Phương thức thanh toán</div>
            <div className="checkout__payment__items">
              {paymentMethods.map((pMethod) => (
                <div key={pMethod.id} className="checkout__payment__items__icon">
                  <div className="checkout__payment__items__icon__upper">
                    <label htmlFor={pMethod.id}>{pMethod.label}</label>
                    <input
                      id={pMethod.id}
                      name="paymentMethod"
                      value={pMethod.value}
                      type="radio"
                      checked={selectedPayment === pMethod.value}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="checkout__payment__items__icon__lower">
                    <img src={pMethod.img} alt={pMethod.label} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="checkout__shipping">
            <div className="checkout__shipping__title">Phương thức vận chuyển</div>
            <div className="checkout__shipping__items">
              {shippingMethods.map((method) => (
                <div key={method.id} className="checkout__shipping__items__icon">
                  <div className="checkout__shipping__items__icon__upper">
                    <label htmlFor={method.id}> {method.label}</label>
                    <input
                      id={method.id}
                      name="shippingMethod"
                      value={method.value}
                      type="radio"
                      checked={selectedShipping === method.value}
                      onChange={handleShippingChange}
                    ></input>
                  </div>
                  <div className="checkout__shipping__items__icon__lower">
                    <img src={method.img} alt={method.label} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="checkout__shipping-voucher">
            <div className="checkout__shipping-voucher__title">Mã giảm giá</div>
            <div className="checkout__shipping-voucher__content">
              {(() => {
                switch (selectedShipping) {
                  case "Nhận hàng tại cửa hàng":
                    return <div>Không áp dụng mã giảm giá</div>;

                  case "Giao hàng tận nơi":
                    return (
                      <>
                        <ButtonComponent onClick={openModal}>Chọn mã giảm giá</ButtonComponent>
                        {selectedVoucher && (
                          <div className="checkout__shipping-voucher__info">
                            <strong>Đã chọn:</strong> {selectedVoucher.code} -{" "}
                            {selectedVoucher.description}{" "}
                            <CloseCircleOutlined
                              onClick={() => {
                                setSelectedVoucher(null);
                              }}
                            />
                          </div>
                        )}
                      </>
                    );

                  default:
                    return <div>Vui lòng chọn phương thức vận chuyển</div>;
                }
              })()}
            </div>
            <Modal
              title="Chọn mã giảm giá"
              visible={isModalVisible}
              onCancel={closeModal}
              footer={null}
              zIndex={1003}
            >
              <div className="voucher-list">
                {shippingVouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="voucher-item"
                    onClick={() => handleSelectVoucher(voucher)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "10px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div>
                      <strong>{voucher.code}</strong> - {voucher.description}
                    </div>
                    <div>Giảm: {voucher.discount}%</div>
                  </div>
                ))}
              </div>
            </Modal>
          </div>
          <div className="checkout__bills">
            <div className="checkout__bills__content">
              <div className="checkout__bills__content__item">
                <span className="checkout__bills__content__item__title">Sub total</span>
                <span>{formatMoney(grandTotalBeforeShipping)}</span>
              </div>
              <div className="checkout__bills__content__item">
                <span className="checkout__bills__content__item__title">Phí vận chuyển</span>
                <span>{formatMoney(shippingCost)}</span>
              </div>
              <div className="checkout__bills__content__item">
                <span className="checkout__bills__content__item__title">Giảm giá</span>
                <span>
                  {selectedVoucher
                    ? formatMoney((shippingCost * selectedVoucher.discount) / 100)
                    : formatMoney(0)}
                </span>
              </div>
              <div className="checkout__bills__content__item">
                <span className="checkout__bills__content__item__title">Tổng cộng</span>
                <span id="grand-total-checkout">{formatMoney(grandTotal)}</span>
              </div>
            </div>
          </div>
          <div className="checkout__confirm">
            {selectedPayment && selectedShipping && (
              <ButtonComponent onClick={() => setOpenConfirmModal(true)} isActive>
                Thanh toán
              </ButtonComponent>
            )}
          </div>
        </div>
        <ConfirmModal
          title="Xác nhận giao dịch"
          message="Xác nhận bạn muốn mua vật phẩm , không hỗ trợ hoàn tiền"
          confirmText="Xác nhận"
          cancelText="Hủy"
          setOpen={setOpenConfirmModal}
          zIndexProps={1006}
          open={openConfirmModal}
        />
      </div>
    </>
  );
}
