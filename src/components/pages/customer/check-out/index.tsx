import React, { useEffect, useState } from "react";
import "./index.scss";
import { logo } from "../../../../assets/contant";
import ButtonComponent from "../../../atoms/button";
import { ShippingVoucher } from "../../../../model/shippingVoucher";
import { shippingVouchers } from "../../../../dummy-data/mockShippingVoucherData";
import { Modal, Form, Input, message, Checkbox, Button } from "antd";
import {
  CloseCircleOutlined,
  CloseOutlined,
  PlusOutlined,
  UserOutlined,
  PhoneOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { formatMoney } from "../../../../utils/formatMoney";
import ConfirmModal from "../../../molecules/confirm-modal";
import api from "../../../../config/api";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

// Add a utility function to generate unique IDs for local addresses
const generateLocalAddressId = () =>
  `local-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// Cập nhật interface Address
interface Address {
  id: number | string;
  address: string;
  province: string;
  district: string;
  commune: string;
  isDefault?: boolean;
  guestName?: string; // Add this
  guestPhone?: string; // Add this
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
  // Add user from Redux
  const user = useSelector((state: RootState) => state.user);

  // Import the necessary Redux selector to get cart items
  const reduxCartItems = useSelector(
    (state: RootState) => state.cart?.items || []
  );

  // All your existing states...
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<
    number | string | null
  >(null);
  const [isAddressModalVisible, setIsAddressModalVisible] =
    useState<boolean>(false);
  const [addressForm] = Form.useForm();
  const [addressLoading, setAddressLoading] = useState<boolean>(false);

  // Add this state to track which address is being edited
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Add this function to handle edit clicks
  const handleEditAddressClick = (address: Address) => {
    setEditingAddress(address);
    // Pre-fill form with existing address data
    addressForm.setFieldsValue({
      province: address.province,
      district: address.district,
      commune: address.commune,
      address: address.address,
      isDefault: address.isDefault,
      name: address.guestName,
      phone: address.guestPhone,
    });

    setIsAddressModalVisible(true);
  };

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

  // Add new states for guest customer info
  const [guestName, setGuestName] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");

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
    setSelectedShipping(value);
    if (value === "Giao hàng tận nơi") {
      setShippingCost(20000); // Giá cố định 20.000₫
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

    // Log để debug
    console.log({
      tiền_hàng: grandTotalBeforeShipping,
      phí_vận_chuyển: shippingCost,
      giảm_giá: (shippingCost * (selectedVoucher?.discount || 0)) / 100,
      tổng_cộng:
        grandTotalBeforeShipping +
        shippingCost -
        (shippingCost * (selectedVoucher?.discount || 0)) / 100,
    });
  }, [grandTotalBeforeShipping, shippingCost, selectedVoucher]);

  // Fetch địa chỉ người dùng - only if user is logged in
  useEffect(() => {
    if (open) {
      if (user) {
        // User is logged in, fetch from API
        fetchUserAddresses();
      } else {
        // User is not logged in, try to get addresses from localStorage
        const savedAddresses = localStorage.getItem("guestAddresses");
        if (savedAddresses) {
          try {
            const parsedAddresses = JSON.parse(savedAddresses);
            setAddresses(parsedAddresses);

            // Select default address if available
            const defaultAddress = parsedAddresses.find(
              (addr) => addr.isDefault
            );
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id);
            } else if (parsedAddresses.length > 0) {
              setSelectedAddressId(parsedAddresses[0].id);
            }
          } catch (e) {
            console.error("Error parsing saved addresses:", e);
            // In case of error, start with empty addresses
            setAddresses([]);
          }
        }
      }
    }
  }, [open, user]);

  // Add this after the other useEffects
  useEffect(() => {
    if (!user) {
      // Load guest customer info from localStorage
      const savedInfo = localStorage.getItem("guestCustomerInfo");
      if (savedInfo) {
        try {
          const parsedInfo = JSON.parse(savedInfo);
          if (parsedInfo.name) setGuestName(parsedInfo.name);
          if (parsedInfo.phone) setGuestPhone(parsedInfo.phone);
        } catch (e) {
          console.error("Error parsing guest info:", e);
        }
      }
    }
  }, [user]);

  // Modified function to fetch addresses - only for logged in users
  const fetchUserAddresses = async () => {
    try {
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

  // Modify the address handling function to handle updates and save guest info
  const handleAddAddress = async (values: any) => {
    setAddressLoading(true);

    try {
      // Validate input
      if (
        !values.province ||
        !values.district ||
        !values.commune ||
        !values.address
      ) {
        message.error("Vui lòng điền đầy đủ thông tin địa chỉ");
        return;
      }

      if (user) {
        // User is logged in, use API
        if (editingAddress) {
          // Editing existing address
          const response = await api.put(
            `/address/user/${editingAddress.id}`,
            values
          );
          if (response.data) {
            setAddresses((prev) =>
              prev.map((addr) =>
                addr.id === editingAddress.id ? response.data : addr
              )
            );
            message.success("Cập nhật địa chỉ thành công!");
          }
        } else {
          // Adding new address
          const response = await api.post("/address/user", values);
          if (response.data && response.data.id) {
            const newAddress = response.data;
            setAddresses((prev) => [...prev, newAddress]);
            setSelectedAddressId(newAddress.id);
            message.success("Thêm địa chỉ thành công!");
          }
        }
      } else {
        // Guest user - save to local state and localStorage

        // Save guest name and phone
        const guestName = values.name;
        const guestPhone = values.phone;

        setGuestName(guestName);
        setGuestPhone(guestPhone);

        // Also save to localStorage for later use
        localStorage.setItem(
          "guestCustomerInfo",
          JSON.stringify({
            name: guestName,
            phone: guestPhone,
          })
        );

        if (editingAddress) {
          // Updating existing address
          const updatedAddress = {
            ...editingAddress,
            address: values.address,
            province: values.province,
            district: values.district,
            commune: values.commune,
            isDefault: values.isDefault,
            guestName: guestName, // Include guest info
            guestPhone: guestPhone,
          };

          const updatedAddresses = addresses.map((addr) =>
            addr.id === editingAddress.id
              ? updatedAddress
              : // If this address is marked as default, unmark others
              updatedAddress.isDefault && addr.isDefault
              ? { ...addr, isDefault: false }
              : addr
          );

          setAddresses(updatedAddresses);
          localStorage.setItem(
            "guestAddresses",
            JSON.stringify(updatedAddresses)
          );
          message.success("Cập nhật địa chỉ thành công!");
        } else {
          // Adding new address
          const newAddress = {
            id: generateLocalAddressId(),
            address: values.address,
            province: values.province,
            district: values.district,
            commune: values.commune,
            isDefault: values.isDefault || addresses.length === 0,
            guestName: guestName, // Include guest info
            guestPhone: guestPhone,
          };

          // Handle default address logic
          let updatedAddresses;
          if (newAddress.isDefault) {
            updatedAddresses = addresses.map((addr) => ({
              ...addr,
              isDefault: false,
            }));
            updatedAddresses.push(newAddress);
          } else {
            updatedAddresses = [...addresses, newAddress];
          }

          setAddresses(updatedAddresses);
          setSelectedAddressId(newAddress.id);
          localStorage.setItem(
            "guestAddresses",
            JSON.stringify(updatedAddresses)
          );
          message.success("Thêm địa chỉ thành công!");
        }
      }

      // Reset form and close modal
      setIsAddressModalVisible(false);
      addressForm.resetFields();
      setEditingAddress(null); // Clear editing state

      // Set shipping method if first address
      if (addresses.length === 0) {
        setSelectedShipping("Giao hàng tận nơi");
        setShippingCost(grandTotalBeforeShipping * 0.1);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý địa chỉ:", error);
      message.error(
        user
          ? "Không thể lưu địa chỉ. Vui lòng thử lại."
          : "Có lỗi xảy ra khi lưu thông tin địa chỉ."
      );
    } finally {
      setAddressLoading(false);
    }
  };

  // Updated handleCreateOrder function with the correct endpoint for guest users
  const handleCreateOrder = async () => {
    // Validation checks remain the same...
    if (!selectedAddressId || !selectedPayment || !selectedShipping) {
      message.error("Vui lòng chọn đầy đủ thông tin giao hàng");
      return;
    }

    // Get the selected address
    const selectedAddress = addresses.find(
      (addr) => addr.id === selectedAddressId
    );
    if (!selectedAddress) {
      message.error("Địa chỉ không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      // Ánh xạ selectedShipping sang shippingType
      const getShippingType = (shipping) => {
        switch (shipping) {
          case "Giao hàng tận nơi":
            return "HOME_DELIVERY";
          case "Nhận hàng tại cửa hàng":
            return "IN_STORE_PICKUP";
          default:
            return "HOME_DELIVERY";
        }
      };

      // Create base payment payload with shared properties
      const basePayload = {
        description: `FODOSH xin cảm ơn`,
        shippingMethod: selectedShipping,
        paymentMethod: selectedPayment,
        returnUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancel`,
        shippingType: getShippingType(selectedShipping), // Thêm shippingType
        totalPrice: grandTotalState, // Thêm totalPrice
      };

      // Create the full payload based on user authentication status
      const payload = user
        ? {
            // Logged in user payload
            ...basePayload,
            addressId: selectedAddressId,
            cartItemIds: selectedCartItems,
          }
        : {
            // Guest user payload
            ...basePayload,
            guest: true,
            guestName: guestName,
            guestPhone: guestPhone,
            productIds: reduxCartItems
              .filter((item) => selectedCartItems.includes(item.id))
              .map((item) => item.id),
            guestAddress: {
              address: selectedAddress.address,
              province: selectedAddress.province,
              district: selectedAddress.district,
              commune: selectedAddress.commune,
              guestName: guestName,
              guestPhone: guestPhone,
            },
          };

      console.log("Sending order payload:", payload);

      // Use the appropriate endpoint based on auth status
      const endpoint = user ? "/payment/create" : "/payment/create/guest";
      const response = await api.post(endpoint, payload);

      // Rest of the function remains the same...
      if (response.data?.data?.checkoutUrl) {
        window.location.href = response.data.data.checkoutUrl;
      } else {
        message.success(
          user
            ? "Đặt hàng thành công! Cảm ơn bạn đã mua hàng."
            : "Đặt hàng thành công! Bạn sẽ nhận được cuộc gọi xác nhận từ chúng tôi."
        );

        // If guest and COD, still save locally for reference
        if (!user) {
          const guestOrder = {
            orderId: `GUEST-${Date.now()}`,
            serverOrderId: response.data?.data?.orderId || null,
            items: selectedCartItems,
            address: selectedAddress,
            shippingMethod: selectedShipping,
            paymentMethod: selectedPayment,
            total: grandTotalState,
            orderDate: new Date().toISOString(),
            customerName: guestName,
            customerPhone: guestPhone,
          };

          const existingOrders = JSON.parse(
            localStorage.getItem("guestOrders") || "[]"
          );
          localStorage.setItem(
            "guestOrders",
            JSON.stringify([...existingOrders, guestOrder])
          );
        }

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
            <div className="checkout__address__title">
              Địa chỉ giao hàng
              {!user && <span className="guest-mode-tag"> (Chế độ khách)</span>}
            </div>
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
                      {/* Add this section to display guest contact info */}
                      {!user && address.guestName && address.guestPhone && (
                        <div className="checkout__address__items__item__content__contact">
                          <div className="checkout__address__items__item__content__contact__name">
                            <UserOutlined /> {address.guestName}
                          </div>
                          <div className="checkout__address__items__item__content__contact__phone">
                            <PhoneOutlined /> {address.guestPhone}
                          </div>
                        </div>
                      )}
                      <div className="checkout__address__items__item__content__address">
                        {address?.address}, {address?.commune},{" "}
                        {address?.district}, {address?.province}
                      </div>
                    </div>

                    {/* Add Edit button for guest addresses */}
                    {!user && (
                      <div
                        className="checkout__address__items__item__edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAddressClick(address);
                        }}
                      >
                        <Button type="text" icon={<EditOutlined />} />
                      </div>
                    )}
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
          message={
            user
              ? "Xác nhận bạn muốn mua vật phẩm, không hỗ trợ hoàn tiền"
              : "Xác nhận mua hàng. Lưu ý: Bạn đang mua hàng ở chế độ khách."
          }
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
          width={500}
          centered
        >
          <Form
            form={addressForm}
            layout="vertical"
            onFinish={handleAddAddress}
            initialValues={{
              isDefault: addresses.length === 0,
              name: guestName, // Pre-fill with existing values if any
              phone: guestPhone,
            }}
          >
            {!user && (
              <div className="guest-address-notice">
                <p>
                  Bạn đang thêm địa chỉ ở chế độ khách. Thông tin này sẽ được
                  lưu trên thiết bị của bạn.
                </p>
              </div>
            )}

            {/* Add guest information fields if not logged in */}
            {!user && (
              <>
                <div className="form-section-title">Thông tin liên hệ</div>
                <Form.Item
                  name="name"
                  label="Họ tên"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ tên" },
                    { max: 100, message: "Tối đa 100 ký tự" },
                  ]}
                >
                  <Input
                    placeholder="Nhập họ tên khách hàng"
                    prefix={<UserOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="phone"
                  label="Số điện thoại"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                    {
                      pattern: /^[0-9]{9,11}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập số điện thoại liên hệ"
                    prefix={<PhoneOutlined />}
                  />
                </Form.Item>

                <div className="form-section-title">Địa chỉ giao hàng</div>
              </>
            )}

            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[
                { required: true, message: "Vui lòng nhập tỉnh/thành phố" },
                { max: 100, message: "Tối đa 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tỉnh/thành phố" />
            </Form.Item>

            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[
                { required: true, message: "Vui lòng nhập quận/huyện" },
                { max: 100, message: "Tối đa 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập quận/huyện" />
            </Form.Item>

            <Form.Item
              name="commune"
              label="Phường/Xã"
              rules={[
                { required: true, message: "Vui lòng nhập phường/xã" },
                { max: 100, message: "Tối đa 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập phường/xã" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ chi tiết"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ chi tiết" },
                { max: 200, message: "Tối đa 200 ký tự" },
              ]}
            >
              <Input.TextArea
                placeholder="Số nhà, tên đường..."
                rows={3}
                showCount
                maxLength={200}
              />
            </Form.Item>

            <Form.Item name="isDefault" valuePropName="checked">
              <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
            </Form.Item>

            <Form.Item>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "flex-end",
                }}
              >
                <Button onClick={() => setIsAddressModalVisible(false)}>
                  Hủy
                </Button>
                <ButtonComponent
                  htmlType="submit"
                  isActive
                  disabled={addressLoading}
                >
                  {addressLoading ? "Đang xử lý..." : "Thêm địa chỉ"}
                </ButtonComponent>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
}
