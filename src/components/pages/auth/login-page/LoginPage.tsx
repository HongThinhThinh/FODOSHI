import React from "react";
import { Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import ButtonComponent from "../../../atoms/button";
import useApiService from "../../../../hooks/useApi";
import { useDispatch } from "react-redux";
import { login } from "../../../../redux/features/userSlice";

export default function LoginPage() {
  const [form] = Form.useForm();
  const { callApi, loading } = useApiService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values: any) => {
    const { username, password } = values;
    const payload = {
      phoneNumber: username,
      password,
    };

    try {
      const response = await callApi("post", "login", payload);
      localStorage.setItem("token", response.data.token);
      console.log("Login successful", response);
      dispatch(login(response.data));
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login failed", error);
      // Xử lý thông báo lỗi cho người dùng...
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 pb-8">
      {/* Card đăng nhập */}
      <div className="w-full max-w-md rounded-lg shadow-lg p-6 border">
        <h1 className="text-center text-2xl mb-4">Sign in</h1>

        {/* Form Ant Design */}
        <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-3">
          <Form.Item
            label="Email or mobile phone number"
            name="username"
            rules={[{ required: true, message: "Please enter your email or phone" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Your password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>

          {/* Nút Login */}
          <Form.Item className="mb-0">
            <ButtonComponent
              bgColor="#66666680"
              color="#fff"
              shape="round"
              htmlType="submit"
              className=" w-full p-5 "
              loading={loading}
            >
              Log in
            </ButtonComponent>
          </Form.Item>
        </Form>

        {/* Điều khoản */}
        <p className="text-center text-xs text-gray-500 mt-2">
          By continuing you agree to the{" "}
          <Link to="#" className="underline">
            Terms of use
          </Link>{" "}
          and{" "}
          <Link to="#" className="underline">
            Privacy Policy
          </Link>
          .
        </p>

        {/* Liên kết phụ */}
        <div className="flex justify-between text-sm mt-4">
          <Link to="#" className="underline">
            Other issue with sign in?
          </Link>
          <Link to="#" className="underline">
            Forgot your password?
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
          to="/test-auth/register"
          className="inline-block border border-black rounded-full px-6 py-2 text-sm hover:bg-gray-50 w-full"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
