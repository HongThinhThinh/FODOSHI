import React, { useEffect } from "react";
import "./index.scss";
import ggIcon from "../../../../assets/google.png";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { WarningFilled } from "@ant-design/icons";
import api from "../../../../config/api";
import { login } from "../../../../redux/features/userSlice";
import { toast } from "react-toastify";
const provider = new GoogleAuthProvider();

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}
const MyFormItemContext = React.createContext([]);

// eslint-disable-next-line react/prop-types
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

// eslint-disable-next-line react/prop-types
// const MyFormItem = ({ name, children, ...props }) => {
//   const prefixPath = React.useContext(MyFormItemContext);
//   const concatName =
//     name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
//   console.log(children);
//   return (
//     <Form.Item name={name} {...props}>
//       {children}
//     </Form.Item>
//   );
// };

function Login() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginGoogle = async () => {
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    const token = result.user.accessToken;
    console.log(token);
    // api.post("/login-gg", { token }).then((data) => {
    //   if (data) {
    //     localStorage.setItem("role", data);
    //     navigate("/creator");
    //   }
    // });

    const res = await api.post("/login-google", { token: token });
    const role = res.data.role;

    console.log(res.data.role);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("accountId", res.id);
    //save redux
    dispatch(login(res.data));
    if (role === "ADMIN") {
      navigate("/dashboard");
    }
    if (role === "MOD") {
      navigate("/dashboard");
    }
    if (role === "CREATOR") {
      navigate("/creator-manage/artworks");
    }
    if (role === "AUDIENCE") {
      navigate("/profile");
    }
  };

  const onFinish = async (value) => {
    try {
      const response = await api.post("/login", value);
      console.log(response.data);
      const role = response.data.data.role;
      console.log(role);
      const user = response.data.data;
      console.log(user);
      localStorage.setItem("token", response.data.data.token);
      localStorage.setItem("accountId", response.data.data.id);
      //save redux
      dispatch(login(user));
      if (role === "ADMIN") {
        navigate("/dashboard");
      }
      if (role === "MOD") {
        navigate("/dashboard");
      }
      if (role === "CREATOR") {
        navigate("/creator-manage/artworks");
      }
      if (role === "AUDIENCE") {
        navigate("/profile");
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data + "Please Try Again");
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <Row container className="login">
      <Col md={24} lg={7} className="login__side-bar">
        <video
          muted
          autoPlay
          loop
          preload="auto"
          className="login__side-bar__media"
          src="https://cdn.dribbble.com/uploads/48226/original/b8bd4e4273cceae2889d9d259b04f732.mp4?1689028949"
        ></video>
      </Col>
      <Col md={24} lg={17} className="login__form">
        <Col lg={14} className="login__form__container">
          <h3>Sign in to FODOSHI</h3>
          <Button
            onClick={handleLoginGoogle}
            className="login__form__container__gg-btn"
          >
            <img src={ggIcon} />
            Sign in with Google
          </Button>
          <Divider className="login__form__container__divider" plain>
            or sign in with email
          </Divider>
          <Form
            className="login__form__container__namepass"
            name="form_item_path"
            layout="vertical"
            onFinish={onFinish}
          >
            <MyFormItemGroup className="login__form__container__namepass__group-form">
              {/* <MyFormItem
                name="username"
                className="login__form__container__namepass__group-form"
              >
                <label className="login__form__container__namepass__group-form__label">
                  Username or Email
                </label>
                <Input className="login__form__container__namepass__group-form__input" />
              </MyFormItem> */}
              <Form.Item
                label="Phone Number"
                name="phoneNumber"
                className="login__form__container__namepass__group-form"
                rules={[
                  {
                    required: true,
                    message: (
                      <div>
                        <WarningFilled /> Please input your username!
                      </div>
                    ),
                  },
                ]}
              >
                <Input className="login__form__container__namepass__group-form__input" />
              </Form.Item>
              {/* <MyFormItem className="login__form__container__namepass__group-form">
                <label className="login__form__container__namepass__group-form__label">
                  Password
                </label>
                <Input className="login__form__container__namepass__group-form__input" />
              </MyFormItem> */}
              <Form.Item
                label={
                  <label
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>Password</p>
                    <Link
                      to="/password_resets/new"
                      className="login__form__container__linkToSignUp__signUp"
                    >
                      Forgot?
                    </Link>
                  </label>
                }
                name="password"
                className="login__form__container__namepass__group-form"
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
                    required: true,
                    message: (
                      <div>
                        <WarningFilled /> Please input your password!
                      </div>
                    ),
                  },
                ]}
              >
                <Input.Password className="login__form__container__namepass__group-form__input" />
              </Form.Item>
            </MyFormItemGroup>
            <Button
              className="login__form__container__namepass__submit"
              htmlType="submit"
            >
              Sign in
            </Button>
          </Form>
          <h5 className="login__form__container__linkToSignUp">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="login__form__container__linkToSignUp__signUp"
            >
              Sign up
            </Link>
          </h5>
        </Col>
      </Col>
    </Row>
  );
}

export default Login;
