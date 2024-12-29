import { Checkbox, Form } from "antd";
import { logo } from "../../../../assets/contant";
import { useLocation } from "react-router-dom";
import InputComponent from "../../../atoms/input";
import ButtonComponent from "../../../atoms/button";
import "./styles.scss";
function ConfirmPassword() {
  const [form] = Form.useForm();
  const location = useLocation();
  const { email } = location.state || {};
  return (
    <section className="max-w-[550px] mx-auto my-10">
      <div className="container confirm-password-container">
        <img src={logo} alt="" className="inline-block w-[40%] mb-8" />
        <div className="confirm-password-form">
          <h1 className="confirm-password-title">
            Nhập mã xác nhận để đặt lại mật khẩu nha!
          </h1>
          <div className="btn-wrapper--change">
            Fodoshi đã gửi mã xác nhận đến
            <p>{email}</p>
          </div>
          <Form form={form}>
            <Form.Item
              className="confirm-password-item"
              name="confirmationCode"
              rules={[
                { required: true, message: "Làm ơn hãy nhập mã xác nhận!" },
              ]}
            >
              <InputComponent height="55px" placeholder="Mã xác nhận*" />
            </Form.Item>
            <Form.Item
              className="confirm-password-item"
              name="password"
              rules={[{ required: true, message: "Làm ơn hãy nhập mật khẩu!" }]}
            >
              <InputComponent.Password height="55px" placeholder="Mật khẩu*" />
            </Form.Item>

            <Form.Item
              name="acceptNewsletter"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Làm ơn hãy đồng ý nhận tin tức từ Fodoshi!"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                Đăng ký email để nhận tin tức từ Fodoshi về sản phẩm, ưu đã và
                đặc quyền dành cho thành viên bạn nhé!
              </Checkbox>
            </Form.Item>

            <Form.Item
              name="acceptTerms"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(
                            "Làm ơn hãy đồng ý với Chính sách và Điều khoản của Fodoshi!"
                          )
                        ),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với Chính sách Quyền riêng tư và Điều khoản của
                Fodoshi
              </Checkbox>
            </Form.Item>
            <Form.Item className="confirm-password-item confirm-password-item--btn">
              <ButtonComponent
                size="large"
                bgColor="#1e3779"
                htmlType="submit"
                shape="round"
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

export default ConfirmPassword;
