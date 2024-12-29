import "./styles.scss";
import { logo } from "../../../../assets/contant";
import { useState } from "react";
import { Link } from "react-router-dom";

function SuccessAuth() {
  const [date, setDate] = useState("");
  return (
    <section className="max-w-[550px] mx-auto my-10">
      <div className="container success-auth-container">
        <img src={logo} alt="" className="inline-block w-[40%]" />
        <h1 className="success-auth-title">
          Mật khẩu của bạn đã được thay đổi vào ngày {date}
        </h1>
        <Link to="/" className="success-auth-link">
          Tiếp tục mua hàng
        </Link>
      </div>
    </section>
  );
}

export default SuccessAuth;
