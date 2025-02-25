/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button, Checkbox, Col, Form, Input, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useApiService from "../../../../hooks/useApi";

export default function RegisterPage() {
  const { callApi, loading } = useApiService();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { firstName, lastName, email, phone, password } = values;
    const payload = {
      name: `${firstName} ${lastName}`,
      email,
      phoneNumber: phone,
      password,
    };

    try {
      const response = await callApi("post", "register", payload);
      console.log("Registration successful", response);
      // Ví dụ: chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
      navigate("/test-auth/login");
    } catch (error) {
      console.error("Registration failed", error);
      // Xử lý thông báo lỗi cho người dùng...
    }
  };

  return (
    <div className="container mx-auto px-10 pb-5 flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/2 mb-6 md:mb-0">
        <h1 className="text-2xl font-semibold text-[#6b2e1f] mb-2">
          Design with us
        </h1>
        <p className="text-[#6b2e1f]">
          Access to thousands of design resources and templates
        </p>
      </div>

      {/* Right Side */}
      <div className="md:w-1/2 bg-white py-6 rounded-lg shadow-lg">
        {/* Container cố định để toàn bộ form có cùng chiều rộng */}
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl mb-4">Sign up now</h1>
          <Form layout="vertical" onFinish={onFinish}>
            {/* Họ và Tên */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    { required: true, message: "Please enter your first name" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please enter your last name" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Email */}
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
              ]}
            >
              <Input type="email" />
            </Form.Item>

            {/* Số điện thoại */}
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
              ]}
            >
              <Input type="tel" />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            {/* Chú thích cho password */}
            <Form.Item>
              <p className="text-xs text-gray-500">
                Use 8 or more characters with a mix of letters, numbers &amp;
                symbols
              </p>
            </Form.Item>

            {/* Checkboxes điều khoản */}
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error("Should accept agreement")),
                },
              ]}
            >
              <Checkbox>
                By creating an account, I agree to our{" "}
                <Link to="" className="underline">
                  Terms of use
                </Link>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
                .
              </Checkbox>
            </Form.Item>
            <Form.Item name="marketing" valuePropName="checked">
              <Checkbox>
                By creating an account, I also consent to receive SMS messages
                and emails, including product updates, events, and marketing
                promotions.
              </Checkbox>
            </Form.Item>

            {/* Nút Sign Up & Link chuyển sang đăng nhập */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="rounded-full"
                loading={loading}
              >
                Sign up
              </Button>
              <span className="ml-4">
                Already have an account?{" "}
                <Link to="/login" className="underline">
                  Log in
                </Link>
              </span>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}
