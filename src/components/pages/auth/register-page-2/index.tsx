import React, { useState } from "react";
import "./index.scss";
import ggIcon from "../../../../assets/google.png";
import { Button, Col, Form, theme, Row, Input, Checkbox, Radio } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { WarningFilled } from "@ant-design/icons";
import {
  alertFail,
  alertSuccess,
  alertSuccessSignUp,
} from "../../../../hooks/useNotification";
import { backIn } from "framer-motion";
import LoadingUI from "../../../atoms/loading";
import api from "../../../../config/api";
import { toast } from "react-toastify";
import videoSource from "../../../../assets/video.mp4";
const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

function SignUp() {
  const { token } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("audience");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const navigae = useNavigate();
  const onFinish = async (value) => {
    setIsLoading(true);
    console.log(value);
    try {
      const response = await api.post("/register", value);
      alertSuccess("Đã đăng ký thành công");

      // Add delay before navigation
      setTimeout(() => {
        navigae("/login");
      }, 1500); // 1.5 seconds delay
    } catch (e) {
      alertFail(e?.response?.data);
    }
    setIsLoading(false);
  };
  const onChange = (e) => {
    setChecked(e.target.checked);
  };
  return (
    <>
      {isLoading ? (
        <LoadingUI />
      ) : (
        <Row container className="signUp">
          <Col md={24} lg={8} className="signUp__side-bar">
            <video
              muted
              autoPlay
              loop
              preload="auto"
              className="signUp__side-bar__media"
              src={videoSource}
            ></video>
          </Col>
          <Col md={24} lg={16} className="signUp__form">
            <Col lg={14} className="signUp__form__container">
              <h3 className="font-semibold">Đăng ký vào FODOSHI</h3>
              <Form
                className="signUp__form__container"
                name="form_item_path"
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  className="signUp__form__container__group-form__label"
                  rules={[
                    {
                      required: true,
                      message: (
                        <div>
                          <WarningFilled /> Vui lòng nhập họ tên!
                        </div>
                      ),
                    },
                    {
                      validator: (_, value) => {
                        if (!value || /^\s/.test(value)) {
                          return Promise.reject(
                            <div>
                              <WarningFilled /> Tên không được bắt đầu bằng
                              khoảng trắng
                            </div>
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    onInput={(e) => setName(e.target.value)}
                    className="signUp__form__container__group-form__input"
                  />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="phoneNumber"
                  className="signUp__form__container__group-form__label"
                  rules={[
                    {
                      required: true,
                      message: (
                        <div>
                          <WarningFilled /> Vui lòng nhập số điện thoại!
                        </div>
                      ),
                    },
                    {
                      pattern: /^(0[2-9][0-9]{8})$/,
                      message: (
                        <div>
                          <WarningFilled /> Số điện thoại không hợp lệ!
                        </div>
                      ),
                    },
                    {
                      validator: (_, value) => {
                        if (value && /\s/.test(value)) {
                          return Promise.reject(
                            <div>
                              <WarningFilled /> Số điện thoại không được chứa
                              khoảng trắng
                            </div>
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input
                    onInput={(e) => setPhoneNumber(e.target.value)}
                    className="signUp__form__container__group-form__input"
                    placeholder="Nhập số điện thoại 10 số"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      type: "email",
                      message: (
                        <div>
                          <WarningFilled /> Email không hợp lệ!
                        </div>
                      ),
                    },
                    {
                      required: true,
                      message: (
                        <div>
                          <WarningFilled /> Vui lòng nhập email!
                        </div>
                      ),
                    },
                  ]}
                  className="signUp__form__container__group-form__label"
                >
                  <Input
                    onInput={(e) => setEmail(e.target.value)}
                    className="signUp__form__container__group-form__input"
                  />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (/\s/.test(value)) {
                          return Promise.reject(
                            <div>
                              <WarningFilled /> Mật khẩu không được chứa khoảng
                              trắng
                            </div>
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                    {
                      min: 6,
                      message: (
                        <div>
                          <WarningFilled /> Mật khẩu phải có ít nhất 6 ký tự!
                        </div>
                      ),
                    },
                    {
                      required: true,
                      message: (
                        <div>
                          <WarningFilled /> Vui lòng nhập mật khẩu!
                        </div>
                      ),
                    },
                  ]}
                  className="signUp__form__container__group-form__label"
                >
                  <Input.Password
                    onInput={(e) => setPassword(e.target.value)}
                    className="signUp__form__container__group-form__input"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </Form.Item>
                <Form.Item
                  label="Nhập lại mật khẩu"
                  name="re-password"
                  rules={[
                    {
                      min: 6,
                      message: (
                        <div>
                          <WarningFilled /> Mật khẩu phải có ít nhất 6 ký tự!
                        </div>
                      ),
                    },
                    {
                      required: true,
                      message: (
                        <div>
                          <WarningFilled /> Vui lòng nhập lại mật khẩu!
                        </div>
                      ),
                    },
                    {
                      validator: (_, value) => {
                        if (/\s/.test(value)) {
                          return Promise.reject(
                            <div>
                              <WarningFilled /> Mật khẩu không được chứa khoảng
                              trắng
                            </div>
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                  className="signUp__form__container__group-form__label"
                >
                  <Input.Password
                    onInput={(e) => setPassword(e.target.value)}
                    className="signUp__form__container__group-form__input"
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </Form.Item>

                <Checkbox onChange={onChange}>
                  Tôi đồng ý với{" "}
                  <Link to="" className="about__detail">
                    Điều khoản dịch vụ
                  </Link>
                  ,{" "}
                  <Link to="" className="about__detail">
                    Chính sách bảo mật
                  </Link>
                  , và{" "}
                  <Link to="" className="about__detail">
                    Cài đặt thông báo
                  </Link>{" "}
                  mặc định của FODOSHI
                </Checkbox>

                <Button
                  className="signUp__form__container__submit"
                  htmlType="submit"
                  disabled={!checked}
                  enable={checked}
                  style={
                    checked && { backgroundColor: "#0d0c22", color: "white" }
                  }
                >
                  Tạo tài khoản
                </Button>
              </Form>
              <h5 className="signUp__form__container__linkToSignUp">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="signUp__form__container__linkToSignUp__signUp"
                >
                  Đăng nhập
                </Link>
              </h5>
            </Col>
          </Col>
        </Row>
      )}
    </>
  );
}

export default SignUp;
