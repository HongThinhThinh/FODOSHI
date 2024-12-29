import { Form } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { logo } from "../../../../assets/contant";
import InputComponent from "../../../atoms/input";
import ButtonComponent from "../../../atoms/button";
import "./styles.scss";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
function ForgetPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [form] = useForm();

  const handleNextClick = async () => {
    try {
      await form.validateFields(["email"]);
      // nếu có email navigate qua cofirm còn ko thì thôi
      navigate("/confirm-password", { state: { email } });
    } catch (err) {}
  };
  return (
    <section className="max-w-[550px] mx-auto my-10">
      <div className="container forget-password-container">
        <img src={logo} alt="" className="inline-block w-[40%] mb-8" />
        <div className="forget-password-form">
          <h1 className="forget-password-title">
            Nhập email của bạn để đặt lại mật khẩu nha!
          </h1>
          <Form form={form}>
            <Form.Item
              className="forget-password-item"
              name="email"
              rules={[
                { required: true, message: "Làm ơn hãy nhập email!" },
                {
                  type: "email",
                  message: "Email không đúng!",
                },
              ]}
            >
              <InputComponent
                height="55px"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Item>
            <Form.Item className="forget-password-item">
              <p className="forget-password-item--subtitle">
                Bạn bấm <span className="text-[#1E3779]">tiếp tục</span> là đồng
                ý với Chính sách Quyền riêng tư và Điều khoản của FODOSHI nha!
              </p>
            </Form.Item>
            <Form.Item className="forget-password-item forget-password-item--btn">
              <ButtonComponent
                size="large"
                bgColor="#1e3779"
                shape="round"
                color="#fff"
                onClick={handleNextClick}
              >
                Tiếp tục
              </ButtonComponent>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default ForgetPassword;
