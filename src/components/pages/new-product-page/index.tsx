import { Button, Col, Collapse, Input, Row } from "antd";
import "./styles.scss";
import { showCardModel } from "../../../assets/model";
import ShowCard from "../../atoms/show-card";
import { SearchOutlined } from "@ant-design/icons";
import InputComponent from "../../atoms/input";
const { Panel } = Collapse;

function NewProductPage() {
  const menuItems = {
    category: ["Quần áo", "Giày dép", "Túi xách", "Phụ kiện"],
    gender: ["Nam", "Nữ"],
    brand: ["Thương hiệu A", "Thương hiệu B", "Thương hiệu C"],
    price: ["Dưới 500k", "Từ 500k - 1 triệu", "Trên 1 triệu"],
    stockStatus: ["Còn hàng", "Hết hàng"],
    sale: ["Đang giảm giá"],
  };
  return (
    <section className="new-product-page__container">
      <Row className="new-product-page__wrapper">
        <Col className="new-product-page__aside" span={5}>
          <div className="new-product-page__aside__item rounded-full">
            <span className="border-2 border-black py-1 px-4 rounded-full">
              <SearchOutlined className="text-black  text-[20px]" />
            </span>
            <InputComponent
              placeholder="Tìm kiếm sản phẩm"
              shape="round"
              bgColor="#d9d9d9"
            />
          </div>

          <Collapse defaultActiveKey={[]} accordion={false}>
            <Panel header="Phân loại" key="1">
              {menuItems.gender.map((item, index) => (
                <Button key={index} type="text" className="filter-button">
                  {item}
                </Button>
              ))}
            </Panel>

            <Panel header="Danh mục" key="2">
              {menuItems.category.map((item, index) => (
                <Button key={index} type="text" className="filter-button">
                  {item}
                </Button>
              ))}
            </Panel>

            <Panel header="Thương hiệu" key="3">
              {menuItems.brand.map((item, index) => (
                <Button key={index} type="text" className="filter-button">
                  {item}
                </Button>
              ))}
            </Panel>

            <Panel header="Mức giá" key="4">
              {menuItems.price.map((item, index) => (
                <Button key={index} type="text" className="filter-button">
                  {item}
                </Button>
              ))}
            </Panel>

            <Panel header="Tình trạng đỡ" key="5">
              {menuItems.stockStatus.map((item, index) => (
                <Button key={index} type="text" className="filter-button">
                  {item}
                </Button>
              ))}
            </Panel>

            <Panel header="Sale" key="6">
              {menuItems.sale.map((item, index) => (
                <Button key={index} type="text" className="filter-button">
                  {item}
                </Button>
              ))}
            </Panel>
          </Collapse>
        </Col>
        <Col className="new-product-page__products" span={19}>
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
