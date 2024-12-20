import { useState } from "react";
import { Form } from "antd";
import InputComponent from "../../atoms/input";
import ButtonComponent from "../../atoms/button";
import "./styles.scss";
import { logo } from "../../../assets/contant";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [isEmail, setIsEmail] = useState(true);
  const [form] = Form.useForm();

  const handleNextClick = async () => {
    try {
      await form.validateFields(["email"]);
      setIsEmail(false);
    } catch (err) {}
  };

  return (
    <section className="max-w-[550px] mx-auto my-10">
      <div className="container login-container">
        <img src={logo} alt="" className="inline-block w-[60%]" />
        <div className="login-form">
          <h1 className="login-title">
            {isEmail
              ? "Nhập email của bạn để đăng ký hoặc đăng nhập nha!"
              : "Nhập mật khẩu của bạn để đăng nhập vào Fodoshi nha!"}
          </h1>
          {!isEmail ? (
            <span className="btn-wrapper--change">
              <p>{email}</p>
              <span onClick={() => setIsEmail(true)} className="btn--change">
                Thay đổi*
              </span>
            </span>
          ) : (
            <span className="btn-wrapper--change"></span>
          )}
          <Form form={form}>
            {isEmail && (
              <>
                <Form.Item
                  className="login-item"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    {
                      type: "email",
                      message: "The input is not valid E-mail!",
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
                <Form.Item className="login-item">
                  <span className="login-item--subtitle">
                    Bạn bấm tiếp tục là đồng ý với Chính sách Quyền riêng tư và
                    Điều khoản của FODOSHI nha!
                  </span>
                </Form.Item>
                <Form.Item className="login-item login-item--btn">
                  <ButtonComponent
                    size="large"
                    bgColor="#1e3779"
                    shape="round"
                    onClick={handleNextClick}
                  >
                    Tiếp tục
                  </ButtonComponent>
                </Form.Item>
              </>
            )}
            {!isEmail && (
              <>
                <Form.Item
                  className="login-item"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                    {
                      min: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  ]}
                >
                  <InputComponent.Password
                    height="55px"
                    placeholder="Password*"
                    type="password"
                    name="password"
                  />
                </Form.Item>
                <Form.Item className="login-item">
                  <span className="login-item--subtitle">Quên mật khẩu*</span>
                </Form.Item>
                <Form.Item className="login-item login-item--btn">
                  <ButtonComponent
                    size="large"
                    bgColor="#1e3779"
                    htmlType="submit"
                    shape="round"
                  >
                    Đăng nhập
                  </ButtonComponent>
                </Form.Item>
              </>
            )}
          </Form>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
