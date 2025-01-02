import "./index.scss";

function DeliveryAddress() {
  return (
    <div>
      <form action="" className="form">
        <b>Địa chỉ giao hàng</b>
        <div className="form__item">
          <input
            type="text"
            className="form__input"
            placeholder="Tên người nhận"
          />
        </div>
        <div className="form__item">
          <input
            type="number"
            className="form__input"
            placeholder="Số điện thoại"
          />
        </div>
        <div className="form__item">
          <input type="text" className="form__input" placeholder="Thành phố" />
        </div>
        <div className="form__item">
          <input type="text" className="form__input" placeholder="Quận/Huyện" />
        </div>
        <div className="form__item">
          <input
            type="text"
            className="form__input"
            placeholder="Địa chỉ:(Số nhà/Đường/...)"
          />
        </div>
        <div className="form__item">
          <button className="form__btn">Lưu</button>
          <button className="form__btn">Trở về</button>
        </div>
      </form>
    </div>
  );
}

export default DeliveryAddress;
