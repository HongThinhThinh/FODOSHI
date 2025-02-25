import { Checkbox, Col, Form, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { logo } from "../../../../assets/contant";
import InputComponent from "../../../atoms/input";
import ButtonComponent from "../../../atoms/button";
import "./styles.scss";
import { CiGift } from "react-icons/ci";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
function RegisterPage() {
  const [form] = Form.useForm();
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();
  return (
    <section className="max-w-[550px] mx-auto my-10">
      <div className="container register-container">
        <img src={logo} alt="" className="inline-block w-[40%] mb-8" />
        <div className="register-form">
          <h1 className="register-title">Giờ thì trở thành thành viên của Fodoshi thôi nào!</h1>
          <div className="btn-wrapper--change">
            Fodoshi đã gửi mã xác nhận đến
            <p>{email}</p>
          </div>
          <Form form={form}>
            <Form.Item
              className="register-item"
              name="confirmationCode"
              rules={[{ required: true, message: "Làm ơn hãy nhập mã xác nhận!" }]}
            >
              <InputComponent height="55px" placeholder="Mã xác nhận*" />
            </Form.Item>
            <Row gutter={20}>
              <Col span={12}>
                <Form.Item
                  className="register-item"
                  name="surname"
                  rules={[{ required: true, message: "Làm ơn hãy nhập Họ của bạn!" }]}
                >
                  <InputComponent height="55px" placeholder="Họ*" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  className="register-item"
                  name="name"
                  rules={[{ required: true, message: "Làm ơn hãy nhập tên của bạn!" }]}
                >
                  <InputComponent height="55px" placeholder="Tên*" />
                </Form.Item>
              </Col>
            </Row>

            <p>
              <LiaBirthdayCakeSolid className="inline-block mr-1" size={20} /> Sinh nhật của bạn
            </p>
            <Row gutter={20}>
              <Col span={7}>
                <Form.Item
                  className="register-item"
                  name="day"
                  rules={[
                    {
                      required: true,
                      message: "Làm ơn hãy nhập ngày sinh!",
                    },
                  ]}
                >
                  <InputComponent height="55px" placeholder="ngày*" />
                </Form.Item>
              </Col>
              <Col span={7}>
                <Form.Item
                  className="register-item"
                  name="month"
                  rules={[
                    {
                      required: true,
                      message: "Làm ơn hãy nhập tháng sinh!",
                    },
                  ]}
                >
                  <InputComponent height="55px" placeholder="Tháng*" />
                </Form.Item>
              </Col>

              <Col span={10}>
                <Form.Item
                  className="register-item"
                  name="year"
                  rules={[
                    {
                      required: true,
                      message: "Làm ơn hãy nhập năm sinh!",
                    },
                  ]}
                >
                  <InputComponent height="55px" placeholder="Năm*" />
                </Form.Item>
              </Col>
            </Row>
            <p>
              <CiGift className="inline-block mr-1" size={20} />
              FODOSHI sẽ gửi quà đến bạn vào ngày sinh nhật !
            </p>
            <Form.Item
              className="register-item"
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
                      : Promise.reject(new Error("Làm ơn hãy đồng ý nhận tin tức từ Fodoshi!")),
                },
              ]}
            >
              <Checkbox>
                Đăng ký email để nhận tin tức từ Fodoshi về sản phẩm, ưu đã và đặc quyền dành cho
                thành viên bạn nhé!
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
                          new Error("Làm ơn hãy đồng ý với Chính sách và Điều khoản của Fodoshi!")
                        ),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với Chính sách Quyền riêng tư và Điều khoản của Fodoshi
              </Checkbox>
            </Form.Item>
            <Form.Item className="register-item register-item--btn">
              <ButtonComponent
                size="large"
                bgColor="#1e3779"
                htmlType="submit"
                shape="round"
                color="#fff"
              >
                Tạo tài khoản
              </ButtonComponent>
            </Form.Item>
          </Form>
        </div>
      </div>
    </section>
  );
}

export default RegisterPage;
