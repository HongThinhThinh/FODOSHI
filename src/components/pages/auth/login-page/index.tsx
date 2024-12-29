import { Form } from "antd";
import InputComponent from "../../../atoms/input";
import ButtonComponent from "../../../atoms/button";
import "./styles.scss";
import { logo } from "../../../../assets/contant";
import { useLocation, useNavigate } from "react-router-dom";

function LoginPage() {
  const [form] = Form.useForm();
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  return (
    <section className="max-w-[550px] mx-auto my-10">
      <div className="container login-container">
        <img src={logo} alt="" className="inline-block w-[40%] mb-8" />
        <div className="login-form">
          <h1 className="login-title">
            Nhập mật khẩu của bạn để đăng nhập vào Fodoshi nha!
          </h1>
          <span className="btn-wrapper--change">
            <p>{email}</p>
            <span className="btn--change" onClick={() => navigate("/auth")}>
              Thay đổi*
            </span>
          </span>
          <Form form={form}>
            <Form.Item
              className="login-item"
              name="password"
              rules={[
                { required: true, message: "Làm ơn hãy nhập mật khẩu!" },
                {
                  min: 6,
                  message: "Mật khẩu không được dưới 6 ký tự!",
                },
              ]}
            >
              <InputComponent.Password
                height="55px"
                placeholder="Mật khẩu*"
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
                color="#fff"
              >
                Đăng nhập
              </ButtonComponent>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
