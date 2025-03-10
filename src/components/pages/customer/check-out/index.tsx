import React, { useEffect, useState } from "react";
import "./index.scss";
import { logo } from "../../../../assets/contant";
import ButtonComponent from "../../../atoms/button";
import { ShippingVoucher } from "../../../../model/shippingVoucher";
import { shippingVouchers } from "../../../../dummy-data/mockShippingVoucherData";
import { Modal, Form, Input, message, Checkbox } from "antd"; // Thêm Form, Input, Checkbox
import {
  CloseCircleOutlined,
  CloseOutlined,
  PlusOutlined,
} from "@ant-design/icons"; // Thêm PlusOutlined
import { formatMoney } from "../../../../utils/formatMoney";
import ConfirmModal from "../../../molecules/confirm-modal";
import api from "../../../../config/api";

// Cập nhật interface Address
interface Address {
  id: number;
  address: string;
  province: string;
  district: string;
  commune: string;
  isDefault?: boolean;
}

export interface CheckoutProps {
  open?: boolean;
  setOpen: (isOpen: boolean) => void;
  grandTotalBeforeShipping: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  selectedCartItems: string[]; // Thêm prop này
}

export default function Checkout({
  grandTotalBeforeShipping,
  open,
  setOpen,
  shippingFee,
  discount,
  grandTotal,
  selectedCartItems, // Nhận prop này
}: CheckoutProps) {
  // Thêm state cho địa chỉ
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [isAddressModalVisible, setIsAddressModalVisible] =
    useState<boolean>(false);
  const [addressForm] = Form.useForm();
  const [addressLoading, setAddressLoading] = useState<boolean>(false);

  // Các state đã có
  const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedVoucher, setSelectedVoucher] =
    useState<ShippingVoucher | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [shippingCost, setShippingCost] = useState<number>(0);
  const [grandTotalState, setGrandTotalState] = useState<number>(
    grandTotalBeforeShipping
  );
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const closeCheckout = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      id: "credit-card",
      label: "Thanh toán online",
      value: "Credit Card",
      img: "https://cdn-icons-png.flaticon.com/512/6963/6963703.png",
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
    setGrandTotalState(
      grandTotalBeforeShipping +
        shippingCost -
        (shippingCost * (selectedVoucher?.discount || 0)) / 100
    );
  }, [grandTotalBeforeShipping, shippingCost, selectedVoucher]);

  // Fetch địa chỉ người dùng
  useEffect(() => {
    if (open) {
      fetchUserAddresses();
    }
  }, [open]);

  // Hàm lấy danh sách địa chỉ
  const fetchUserAddresses = async () => {
    try {
      // Cập nhật đường dẫn nếu cần
      const response = await api.get("/address/user");
      if (response.data && Array.isArray(response.data)) {
        setAddresses(response.data);
        // Chọn địa chỉ mặc định nếu có
        const defaultAddress = response.data.find((addr) => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else if (response.data.length > 0) {
          setSelectedAddressId(response.data[0].id);
        }
      }
    } catch (error) {
      console.error("Không thể lấy danh sách địa chỉ:", error);
    }
  };

  // Hàm thêm địa chỉ mới
  const handleAddAddress = async (values: any) => {
    setAddressLoading(true);
    try {
      // Thay đổi endpoint từ "/address" thành "/api/address/user"
      const response = await api.post("/address/user", values);
      if (response.data && response.data.id) {
        message.success("Thêm địa chỉ thành công!");
        setAddresses((prev) => [...prev, response.data]);
        setSelectedAddressId(response.data.id);
        setIsAddressModalVisible(false);
        addressForm.resetFields();
      }
    } catch (error) {
      console.error("Lỗi khi thêm địa chỉ:", error);
      message.error("Không thể thêm địa chỉ. Vui lòng thử lại.");
    } finally {
      setAddressLoading(false);
    }
  };

  // Update the handleCreateOrder function to use the correct response structure
  const handleCreateOrder = async () => {
    console.log("handleCreateOrder được gọi");

    if (!selectedCartItems || selectedCartItems.length === 0) {
      message.error("Không có sản phẩm nào được chọn");
      return;
    }

    if (!selectedAddressId) {
      message.error("Vui lòng chọn địa chỉ giao hàng");
      return;
    }

    setIsLoading(true);
    try {
      // Cập nhật payload với addressId
      const payload = {
        description: `FODOSH xin cam on`,
        addressId: selectedAddressId, // Thêm addressId vào payload
        cartItemIds: selectedCartItems,
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
      };

      console.log("Gọi API với payload:", payload);
      const response = await api.post("/payment/create", payload);
      console.log("Nhận response:", response.data);

      // Update to use the correct response structure with data.checkoutUrl
      if (
        response.data &&
        response.data.data &&
        response.data.data.checkoutUrl
      ) {
        console.log("Chuyển hướng đến:", response.data.data.checkoutUrl);
        window.location.href = response.data.data.checkoutUrl;
      } else {
        message.success("Đặt hàng thành công!");
        setOpenConfirmModal(false);
        setOpen(false);
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      message.error("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`checkout__overlay${
          open ? " checkout__overlay--visible" : ""
        }`}
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
              {addresses.length > 0 ? (
                addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`checkout__address__items__item ${
                      selectedAddressId === address.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedAddressId(address.id)}
                  >
                    <div className="checkout__address__items__item__radio">
                      <input
                        type="radio"
                        checked={selectedAddressId === address.id}
                        onChange={() => setSelectedAddressId(address.id)}
                      />
                    </div>
                    <div className="checkout__address__items__item__content">
                      <div className="checkout__address__items__item__content__name">
                        Địa chỉ {address?.isDefault && " (Mặc định)"}
                      </div>
                      <div className="checkout__address__items__item__content__address">
                        {address?.address}, {address?.commune},{" "}
                        {address?.district}, {address?.province}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="checkout__address__items__empty">
                  Chưa có địa chỉ giao hàng
                </div>
              )}
              <div
                className="checkout__address__items__item checkout__address__items__item--add"
                onClick={() => setIsAddressModalVisible(true)}
              >
                <PlusOutlined /> Thêm địa chỉ mới
              </div>
            </div>
          </div>
          <div className="checkout__payment">
            <div className="checkout__payment__title">
              Phương thức thanh toán
            </div>
            <div className="checkout__payment__items">
              {paymentMethods.map((pMethod) => (
                <div
                  key={pMethod.id}
                  className="checkout__payment__items__icon"
                >
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
            <div className="checkout__shipping__title">
              Phương thức vận chuyển
            </div>
            <div className="checkout__shipping__items">
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className="checkout__shipping__items__icon"
                >
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
                        <ButtonComponent onClick={openModal}>
                          Chọn mã giảm giá
                        </ButtonComponent>
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
              style={{
                backgroundColor: "white",
              }}
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
                <span className="checkout__bills__content__item__title">
                  Sub total
                </span>
                <span>{formatMoney(grandTotalBeforeShipping)}</span>
              </div>
              <div className="checkout__bills__content__item">
                <span className="checkout__bills__content__item__title">
                  Phí vận chuyển
                </span>
                <span>{formatMoney(shippingCost)}</span>
              </div>
              <div className="checkout__bills__content__item">
                <span className="checkout__bills__content__item__title">
                  Giảm giá
                </span>
                <span>
                  {selectedVoucher
                    ? formatMoney(
                        (shippingCost * selectedVoucher.discount) / 100
                      )
                    : formatMoney(0)}
                </span>
              </div>
              <div className="checkout__bills__content__item">
                <span className="checkout__bills__content__item__title">
                  Tổng cộng
                </span>
                <span id="grand-total-checkout">
                  {formatMoney(grandTotalState)}
                </span>
              </div>
            </div>
          </div>
          <div className="checkout__confirm">
            {selectedPayment && selectedShipping && (
              <ButtonComponent
                onClick={() => setOpenConfirmModal(true)}
                isActive
              >
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
          onConfirm={handleCreateOrder}
          isLoading={isLoading}
        />
        <Modal
          title="Thêm địa chỉ mới"
          visible={isAddressModalVisible}
          onCancel={() => setIsAddressModalVisible(false)}
          footer={null}
          zIndex={1005}
        >
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleAddAddress}
          >
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
              ]}
            >
              <Input placeholder="Nhập tỉnh/thành phố" />
            </Form.Item>

            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: "Vui lòng nhập quận/huyện" }]}
            >
              <Input placeholder="Nhập quận/huyện" />
            </Form.Item>

            <Form.Item
              name="commune"
              label="Phường/Xã"
              rules={[{ required: true, message: "Vui lòng nhập phường/xã" }]}
            >
              <Input placeholder="Nhập phường/xã" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ chi tiết"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
              ]}
            >
              <Input.TextArea placeholder="Số nhà, tên đường..." rows={3} />
            </Form.Item>

            <Form.Item name="isDefault" valuePropName="checked">
              <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
            </Form.Item>

            <Form.Item>
              <ButtonComponent
                htmlType="submit"
                isActive
                disabled={addressLoading}
              >
                {addressLoading ? "Đang xử lý..." : "Thêm địa chỉ"}
              </ButtonComponent>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
