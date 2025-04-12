import React, { useEffect } from "react";
import "./index.scss";
import ggIcon from "../../../../assets/google.png";
import videoSource from "../../../../assets/video.mp4";
import { Button, Col, Divider, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { WarningFilled } from "@ant-design/icons";
import api from "../../../../config/api";
import { login } from "../../../../redux/features/userSlice";
import { toast, ToastContainer } from "react-toastify";
import useApiService from "../../../../hooks/useApi";
import { alertFail, alertSuccess } from "../../../../hooks/useNotification";
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

function Login() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { callApi, loading } = useApiService();
  const handleLoginGoogle = async () => {
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      console.log(result);
      // Get token from Google Auth
      const token = result.user.accessToken;

      // Use callApi instead of direct api.post
      const response = await callApi("post", "login-google", { token: token });
      console.log(response);
      // Store tokens in localStorage (same pattern as regular login)
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);

      // Show success message
      toast.success("Đăng nhập thành công");

      // Update Redux store with user data
      dispatch(login(response.data));

      // Use simplified navigation logic matching onFinish
      if (response?.data.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.");
    }
  };

  const onFinish = async (value) => {
    try {
      // Create payload with expected parameter names
      const payload = {
        phoneNumber: value.phoneNumber,
        password: value.password,
      };

      // Use callApi instead of api.post directly
      const response = await callApi("post", "login", payload);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      dispatch(login(response.data));
      // Simplify navigation logic
      if (response?.data.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      alertFail("Đăng nhập thất bại. Vui lòng thử lại.");
      // console.error("");
      // toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Row className="login">
      <ToastContainer />
      <Col span={24} className="login__side-bar">
        <video
          muted
          autoPlay
          loop
          playsInline
          disablePictureInPicture
          preload="metadata"
          className="login__side-bar__media"
          src={videoSource}
        ></video>
      </Col>
      <Col span={24} className="login__form">
        <div className="login__form__container">
          <h3 className="font-semibold">Đăng nhập vào FODOSHI</h3>
          <Button
            onClick={handleLoginGoogle}
            className="login__form__container__gg-btn"
          >
            <img src={ggIcon} alt="Google icon" />
            Đăng nhập với Google
          </Button>
          <Divider className="login__form__container__divider" plain>
            Hoặc đăng nhập bằng số điện thoại
          </Divider>
          <Form
            className="login__form__container__namepass"
            name="form_item_path"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              className="login__form__container__namepass__group-form"
              rules={[
                {
                  required: true,
                  message: (
                    <div>
                      <WarningFilled /> Hãy nhập số điện thoại của bạn!
                    </div>
                  ),
                },
              ]}
            >
              <Input className="login__form__container__namepass__group-form__input" />
            </Form.Item>
            <Form.Item
              label={
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>Mật khẩu</span>
                  <Link
                    to="/password_resets/new"
                    className="login__form__container__linkToSignUp__signUp"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              }
              name="password"
              className="login__form__container__namepass__group-form"
              rules={[
                {
                  validator: (_, value) => {
                    if (value && /\s/.test(value)) {
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
                  required: true,
                  message: (
                    <div>
                      <WarningFilled /> Hãy nhập mật khẩu của bạn!
                    </div>
                  ),
                },
              ]}
            >
              <Input.Password className="login__form__container__namepass__group-form__input" />
            </Form.Item>
            <Button
              className="login__form__container__namepass__submit"
              htmlType="submit"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form>
          <h5 className="login__form__container__linkToSignUp">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="login__form__container__linkToSignUp__signUp"
            >
              Đăng ký ngay
            </Link>
          </h5>
        </div>
      </Col>
    </Row>
  );
}

export default Login;
