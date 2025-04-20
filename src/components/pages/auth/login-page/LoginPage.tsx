import React, { useEffect } from "react"; // Thêm useEffect
import { Form, message } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation
import ButtonComponent from "../../../atoms/button";
import useApiService from "../../../../hooks/useApi";
import { useDispatch } from "react-redux";
import { login } from "../../../../redux/features/userSlice";
import InputComponent from "../../../atoms/input";
import { useMediaQuery } from "react-responsive";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [form] = Form.useForm();
  const { callApi, loading } = useApiService();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy location từ react-router
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const isBigScreen = useMediaQuery({ query: "(min-width: 750px)" });

  useEffect(() => {
    if (location.state?.message) {
      messageApi.info(location.state.message);
    }
  }, [location, messageApi]);

  const onFinish = async (values: any) => {
    const { username, password } = values;
    const payload = {
      phoneNumber: username,
      password,
    };
    try {
      const response = await callApi("post", "login", payload);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      toast.success("Login successful");
      dispatch(login(response.data));
      if (response?.data.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Login failed", error);
      // Xử lý thông báo lỗi cho người dùng...
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 pb-8">
      {contextHolder}
      {/* Card đăng nhập */}
      <div className="w-full max-w-md rounded-lg shadow-lg p-6 border">
        <h1 className="text-center text-2xl mb-4">Đăng nhập</h1>

        {/* Form Ant Design */}
        <Form form={form} layout="vertical" onFinish={onFinish} className="">
          <Form.Item
            label="Số điện thoại"
            name="username"
            rules={[
              { required: true, message: "Please enter your email or phone" },
            ]}
          >
            <InputComponent size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <InputComponent.Password size="large" />
          </Form.Item>

          {/* Nút Login */}
          <Form.Item className="mb-0">
            <ButtonComponent
              bgColor="#66666680"
              color="#fff"
              shape="round"
              htmlType="submit"
              size="large"
              className=" w-full p-5 "
              loading={loading}
            >
              Đăng nhập
            </ButtonComponent>
          </Form.Item>
        </Form>

        {/* Điều khoản */}
        <p className="text-center text-xs text-gray-500 mt-2">
          Bằng cách tiếp tục, bạn đồng ý với{" "}
          <Link to="#" className="underline">
            Chính sách bảo mật của Fodoshi
          </Link>
          {"  "}
          <Link to="#" className="underline"></Link>.
        </p>

        {/* Liên kết phụ */}
        <div
          className={`flex items-center gap-5 text-sm mt-4 ${
            isBigScreen ? "justify-between" : "flex-col justify-center"
          }`}
        >
          <Link to="#" className="underline">
            Vấn đề khác khi đăng nhập ?
          </Link>
          <Link to="/forget-password" className="underline">
            Quên Mật khẩu
          </Link>
        </div>
      </div>

      {/* Hai đường kẻ chia đôi, có khoảng trống ở giữa */}
      <div className="flex items-center w-full max-w-md my-6">
        {/* Đường kẻ bên trái */}
        <div className="border-b border-gray-300 w-1/2"></div>
        {/* Khoảng trống ở giữa */}
        <div className="w-6"></div>
        {/* Đường kẻ bên phải */}
        <div className="border-b border-gray-300 w-1/2"></div>
      </div>

      {/* Nút Create an account */}
      <div className="w-full max-w-md text-center">
        <Link
          to="/register"
          className="inline-block border border-black rounded-full px-6 py-2 text-sm hover:bg-gray-50 w-full"
        >
          Tạo tài khoản
        </Link>
      </div>
    </div>
  );
}
