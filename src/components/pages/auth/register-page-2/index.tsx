import React, { useState } from "react";
import "./SignUp.scss";
import ggIcon from "../../assets/google.png";
import { Button, Col, Form, theme, Row, Input, Checkbox, Radio } from "antd";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LogoWhite from "../../component/logoWhite/LogoWhite";
import api from "../../config/axios";
import { WarningFilled } from "@ant-design/icons";
import {
  alertFail,
  alertSuccessSignUp,
} from "../../assets/hook/useNotification";
import Loading from "../../component/loading/Loading";
import { backIn } from "framer-motion";

const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix]
  );
  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};

const MyFormItem = ({ name, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
  return <Form.Item name={concatName} {...props} />;
};

function SignUp() {
  const { token } = theme.useToken();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState("audience");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [checked, setChecked] = useState(false);
  const navigae = useNavigate();
  const onFinish = async () => {
    setIsLoading(true);
    try {
      console.log(userName);
      const response = await api.post("/signup", {
        userName,
        password,
        name,
        email,
        role,
      });
      alertSuccessSignUp("Please check and confirm to activate this account");
      navigae("/login");
    } catch (e) {
      alertFail(e.response.data);
    }
    setIsLoading(false);
  };
  const onChange = (e) => {
    setChecked(e.target.checked);
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <Row container className="signUp">
          <LogoWhite />
          <Col md={24} lg={8} className="signUp__side-bar">
            <video
              muted
              autoPlay
              loop
              preload="auto"
              className="signUp__side-bar__media"
              src="https://cdn.dribbble.com/uploads/48292/original/30fd1f7b63806eff4db0d4276eb1ac45.mp4?1689187515"
            ></video>
          </Col>
          <Col md={24} lg={16} className="signUp__form">
            <Col lg={14} className="signUp__form__container">
              <h3>Sign up to Cremo</h3>
              <Form
                className="signUp__form__container"
                name="form_item_path"
                layout="vertical"
                onFinish={onFinish}
              >
                <MyFormItemGroup className="signUp__form__container__group-form">
                  <MyFormItem className="signUp__form__container__group-form__flex">
                    <Form.Item
                      label="Name"
                      name="name"
                      className="signUp__form__container__group-form__label"
                      rules={[
                        {
                          required: true,
                          message: (
                            <div>
                              <WarningFilled /> Please input your name!
                            </div>
                          ),
                        },
                        {
                          validator: (_, value) => {
                            if (!value || /^\s/.test(value)) {
                              return Promise.reject(
                                <div>
                                  <WarningFilled /> Name must not start with
                                  whitespace
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
                      label="Username"
                      name="username"
                      className="signUp__form__container__group-form__label"
                      rules={[
                        {
                          required: true,
                          message: (
                            <div>
                              <WarningFilled /> Please input your username!
                            </div>
                          ),
                        },
                        {
                          validator: (_, value) => {
                            if (!/^[a-zA-Z0-9_]*$/.test(value)) {
                              return Promise.reject(
                                <div>
                                  <WarningFilled /> Username must contain only
                                  English characters, numbers, and underscores
                                  NOT whitespace
                                </div>
                              );
                            }

                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input
                        onInput={(e) => setUserName(e.target.value)}
                        onChange={(e) =>
                          e.target.value.includes(" ") ? true : false
                        }
                        className="signUp__form__container__group-form__input"
                      />
                    </Form.Item>
                  </MyFormItem>
                  <MyFormItem className="signUp__form__container__group-form__base">
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        {
                          type: "email",
                          message: (
                            <div>
                              <WarningFilled /> Email is not valid!
                            </div>
                          ),
                        },
                        {
                          required: true,
                          message: (
                            <div>
                              <WarningFilled /> Please input your email!
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
                      label="Password"
                      name="password"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (/\s/.test(value)) {
                              return Promise.reject(
                                <div>
                                  <WarningFilled /> Password must not contain
                                  whitespace
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
                              <WarningFilled /> Password must be at least 6
                              characters!
                            </div>
                          ),
                        },
                        {
                          required: true,
                          message: (
                            <div>
                              <WarningFilled /> Please input your password!
                            </div>
                          ),
                        },
                      ]}
                      className="signUp__form__container__group-form__label"
                    >
                      <Input.Password
                        onInput={(e) => setPassword(e.target.value)}
                        className="signUp__form__container__group-form__input"
                        placeholder="6+ characters"
                      />
                    </Form.Item>
                    <Form.Item
                      label="Re-password"
                      name="re-password"
                      rules={[
                        {
                          min: 6,
                          message: (
                            <div>
                              <WarningFilled /> Password must be at least 6
                              characters!
                            </div>
                          ),
                        },
                        {
                          required: true,
                          message: (
                            <div>
                              <WarningFilled /> Please input your password!
                            </div>
                          ),
                        },
                        {
                          validator: (_, value) => {
                            if (/\s/.test(value)) {
                              return Promise.reject(
                                <div>
                                  <WarningFilled /> Password must not contain
                                  whitespace
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
                        placeholder="6+ characters"
                      />
                    </Form.Item>
                  </MyFormItem>
                </MyFormItemGroup>
                <Checkbox onChange={onChange}>
                  I agree with Cremo{" "}
                  <Link to="" className="about__detail">
                    Terms of Service
                  </Link>
                  ,{" "}
                  <Link to="" className="about__detail">
                    Privacy Policy
                  </Link>
                  , and our default{" "}
                  <Link to="" className="about__detail">
                    Notification Settings
                  </Link>
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
                  Create Account
                </Button>
              </Form>
              <h5 className="signUp__form__container__linkToSignUp">
                Already have an account?
                <Link
                  to="/login"
                  className="signUp__form__container__linkToSignUp__signUp"
                >
                  Sign In
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
