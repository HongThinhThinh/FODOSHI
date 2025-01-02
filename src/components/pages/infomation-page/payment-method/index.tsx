import "./index.scss";

function PaymentMethod() {
  return (
    <div className="method">
      <div className="method__title">Phương thức thanh toán</div>
      <div className="method__description">
        <p>
          Lưu phương thức thanh toán để bạn có thể dễ dàng{" "}
          <span style={{ color: "#1E3779" }}>thanh toán nhanh</span> trong lần
          mua sắp tới
        </p>
        <p>Bạn có thê lưu tối đa 01 thẻ trong hồ sơ của mình</p>
      </div>
      <div className="method__icons">
        <div className="momo">
          <img src="/public/payment-method/1.png" alt="" />
          <p>Hủy liên kết</p>
        </div>
        <div className="vnpay">
          <img src="/public/payment-method/2.png" alt="" />
          <p>Hủy liên kết</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;
