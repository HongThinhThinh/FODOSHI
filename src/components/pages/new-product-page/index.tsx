import { Checkbox, Col, Row } from "antd";
import "./styles.scss";
import { showCardModel } from "../../../assets/model";
import ShowCard from "../../atoms/show-card";

function NewProductPage() {
  return (
    <section className="new-product-page__container">
      <p className="mb-10">trang chủ &gt; Hàng nhập mới</p>
      <h1 className="new-product-page__title">Hàng nhập mới</h1>
      <Row className="new-product-page__wrapper">
        <Col className="new-product-page__aside" span={4}>
          <div className="new-product-page__aside__item">
            <span className="new-product-page__aside__item--title">
              Phân loại
            </span>
            <Checkbox>Nam</Checkbox>
            <Checkbox>Nữ</Checkbox>
          </div>
          <div className="new-product-page__aside__item">
            <span className="new-product-page__aside__item--title">
              Danh mục
            </span>
            <Checkbox>Quần áo</Checkbox>
            <Checkbox>Giày dép</Checkbox>
            <Checkbox>Túi xách</Checkbox>
            <Checkbox>Phụ kiện</Checkbox>
          </div>
        </Col>
        <Col className="new-product-page__products" span={20}>
          <Row justify="space-between" wrap gutter={[20, 20]}>
            {showCardModel?.map((item) => (
              <Col>
                <ShowCard key={item.id} card={item} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </section>
  );
}

export default NewProductPage;
