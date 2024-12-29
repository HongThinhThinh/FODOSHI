import { useState } from "react";
import "./styles.scss";
import { logo } from "../../../../assets/contant";
import { useForm } from "antd/es/form/Form";
import { Form } from "antd";
import InputComponent from "../../../atoms/input";
import ButtonComponent from "../../../atoms/button";
import LoginPage from "../login-page";
import { useNavigate } from "react-router-dom";

function Authentication() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [form] = useForm();

  const handleNextClick = async () => {
    try {
      await form.validateFields(["email"]);
      // nếu có email navigate qua login || navigate qua register
      // if(){

      //   // navigate("/login", { state: { email } });
      // }
      // else{
      navigate("/register", { state: { email } });
      // }
    } catch (err) {}
  };
  return (
    <section className="max-w-[550px] mx-auto my-10">
      <div className="container auth-container">
        <img src={logo} alt="" className="inline-block w-[40%] mb-8" />
        <div className="auth-form">
          <h1 className="auth-title">
            Nhập email của bạn để đăng ký hoặc đăng nhập nha!
          </h1>
          <Form form={form}>
            <Form.Item
              className="auth-item"
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
            <Form.Item className="auth-item">
              <p className="auth-item--subtitle">
                Bạn bấm <span className="text-[#1E3779]">tiếp tục</span> là đồng
                ý với Chính sách Quyền riêng tư và Điều khoản của FODOSHI nha!
              </p>
            </Form.Item>
            <Form.Item className="auth-item auth-item--btn">
              <ButtonComponent
                size="large"
                bgColor="#1e3779"
                shape="round"
                onClick={handleNextClick}
                color="#fff"
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

export default Authentication;
