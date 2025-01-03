import { Col, Form, Row } from "antd";
import "./styles.scss";
import InputComponent from "../../../atoms/input";
import ButtonComponent from "../../../atoms/button";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

function InfoPersonal() {
  return (
    <section>
      <div className="form-infomation-container form-infomation-person-wrapper">
        <h2 className="form-infomation__title">Thông Tin Cá Nhân</h2>
        <Form>
          <Form.Item>
            <InputComponent
              placeholder="Tran Thi"
              shape="square"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <InputComponent placeholder="Yen Thi" shape="square" size="large" />
          </Form.Item>
          <Form.Item>
            <ButtonComponent
              htmlType="submit"
              size="large"
              className="rounded-none px-[25px]"
            >
              LƯU
            </ButtonComponent>
          </Form.Item>
        </Form>
      </div>
      <div className="form-infomation-container form-infomation-login-wrapper">
        <h2 className="form-infomation__title">Thông tin đăng nhập</h2>
        <Form>
          <Form.Item>
            <InputComponent
              placeholder="thittuss170304@fpt.efu.vn"
              shape="square"
              size="large"
              suffix={
                <p className="form-infomation__input--change">Thay đổi*</p>
              }
            />
          </Form.Item>
          <Form.Item>
            <InputComponent
              placeholder="xxxxxxxxxxx"
              shape="square"
              size="large"
              suffix={
                <p className="form-infomation__input--change">Thay đổi*</p>
              }
            />
          </Form.Item>
        </Form>
      </div>
      <div className="form-infomation-container form-infomation-person-wrapper">
        <h2 className="form-infomation__title">Số Điện Thoại Liên Lạc</h2>
        <Form>
          <Row align="middle" gutter={30}>
            <Col span={10}>
              <Form.Item>
                <InputComponent
                  placeholder="Nhập số điện thoại*"
                  shape="square"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item>
                <ButtonComponent
                  size="large"
                  htmlType="submit"
                  className="rounded-none px-[25px]"
                >
                  LƯU
                </ButtonComponent>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <p className="font-[300]">
          Khi lưu tùy chọn này nghĩa là bạn đồng ý nhận tin nhắn (có thể là tự
          động gọi, ghi âm sẵn hoặc quảng cáo) từ Fodoshi. Bạn có thể nhắn
          "STOP" bất cứ lúc nào để hủy đăng ký và sẽ nhận được tin nhắn xác
          nhận.
        </p>
      </div>
    </section>
  );
}

export default InfoPersonal;
