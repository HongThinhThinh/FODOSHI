import "./index.scss";
function DepositPolicy() {
  return (
    <div className="wrapper">
      <div className="form-information">
        <form action="" className="form form-information">
          <div className="form__item">
            <input type="text" className="form__input" placeholder="Tran Thi" />
          </div>
          <div className="form__item">
            <input type="text" className="form__input" placeholder="Yen Thi" />
          </div>
          <div className="form__item">
            <button className="form__btn">Lưu</button>
          </div>
        </form>
      </div>

      <div className="form-account">
        <form action="" className="form form-account">
          <b>Thông Tin Đăng Nhập</b>

          <div className="form__item">
            <input
              type="text"
              className="form__input"
              placeholder="tungnkss160730@fpt.edu.vn"
            />
            <span className="change">Thay đổi*</span>
          </div>
          <div className="form__item">
            <input
              type="text"
              className="form__input"
              placeholder="xxxxxxxxxxxxxxxxx"
            />
            <span className="change">Thay đổi*</span>
          </div>

          <div className="form__item">
            <button className="form__btn">Lưu</button>
          </div>
        </form>
      </div>

      <div className="form-contact">
        <form action="" className="form form-contact">
          <b>Số điện thoại liên lạc</b>

          <div className="form__item">
            <input
              type="text"
              className="form__input"
              placeholder="Nhập số điện thoại"
            />
            <button className="form__btn">Lưu</button>
          </div>
        </form>
        <p>
          Khi lưu tùy chọn này nghĩa là bạn đồng ý nhận tin nhắn (có thể là tự
          động gọi, ghi âm sẵn hoặc quảng cáo) từ Fodoshi. Bạn có thể nhắn
          "STOP" bất cứ lúc nào để hủy đăng ký và sẽ nhận được tin nhắn xác
          nhận.
        </p>
      </div>
    </div>
  );
}

export default DepositPolicy;
