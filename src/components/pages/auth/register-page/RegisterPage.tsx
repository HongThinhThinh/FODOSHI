/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Checkbox, Col, Form, Input, message, Row } from "antd";
import { Link, useNavigate } from "react-router-dom";
import useApiService from "../../../../hooks/useApi";
import ExpandableText from "../../../atoms/ExpendableText";

export default function RegisterPage() {
  const { callApi, loading } = useApiService();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
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
      messageApi.success("Registration successful");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      messageApi.error("Registration failed");
    }
  };

  return (
    <div className="container mx-auto px-4 pb-5 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
      {/* Left Side */}
      <div className="md:w-1/2 mt-8">
        <h1 className="text-4xl font-bold text-[#7d2f2f] mb-6">Design with us</h1>
        <p className="text-xl text-[#7d2f2f]">Access to thousands of design</p>
        <p className="text-xl text-[#7d2f2f]">resources and templates</p>
      </div>

      {/* Right Side - Form Container */}
      <div className="md:w-1/2">
        <div className="mx-auto w-[80%] bg-white py-4 rounded-lg shadow-lg border">
          {/* Container cố định cho form */}
          <div className="mx-auto max-w-sm px-4 py-2">
            <h1 className="text-2xl mb-4">Sign up now</h1>
            <Form layout="vertical" onFinish={onFinish}>
              {/* Họ và Tên */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: "Please enter your first name" }]}
                    style={{ marginBottom: 8 }}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: "Please enter your last name" }]}
                    style={{ marginBottom: 8 }}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              {/* Email */}
              <Form.Item
                label="Email Address"
                name="email"
                rules={[{ required: true, message: "Please enter your email address" }]}
                style={{ marginBottom: 8 }}
              >
                <Input type="email" />
              </Form.Item>

              {/* Số điện thoại */}
              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[{ required: true, message: "Please enter your phone number" }]}
                style={{ marginBottom: 8 }}
              >
                <Input type="tel" />
              </Form.Item>

              {/* Mật khẩu */}
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
                style={{ marginBottom: 8 }}
              >
                <Input.Password />
              </Form.Item>

              {/* Chú thích cho password */}
              <Form.Item style={{ marginBottom: 8 }}>
                <p className="text-xs text-gray-500">
                  Use 8 or more characters with a mix of letters, numbers &amp; symbols
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
                style={{ marginBottom: 2 }}
              >
                <Checkbox>
                  <ExpandableText
                    text="By creating an account, I agree to our Terms of use and Privacy Policy."
                    maxLength={50}
                  />
                </Checkbox>
              </Form.Item>
              <Form.Item name="marketing" valuePropName="checked" style={{ marginBottom: 8 }}>
                <Checkbox>
                  <ExpandableText
                    text="By creating an account, I also consent to receive SMS messages and emails, including product updates, events, and marketing promotions."
                    maxLength={50}
                  />
                </Checkbox>
              </Form.Item>
                a
              {/* Nút Sign Up & Link chuyển sang đăng nhập */}
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" className="rounded-full" loading={loading}>
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
            {contextHolder}
          </div>
        </div>
      </div>
    </div>
  );
}
