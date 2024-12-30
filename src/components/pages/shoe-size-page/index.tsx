import { Table } from "antd";
import "./styles.scss";
import { dataShoeSize } from "../../../assets/contant";

function ShoezizePage() {
  const columns = [
    {
      title: "EU",
      dataIndex: "EU",
      key: "EU",
    },
    {
      title: "KR",
      dataIndex: "KR",
      key: "KR",
    },
    {
      title: "UK",
      dataIndex: "UK",
      key: "UK",
    },
    {
      title: "US",
      dataIndex: "US",
      key: "US",
    },
    {
      title: "IT",
      dataIndex: "IT",
      key: "IT",
    },
  ];
  return (
    <section className="shoe-size-page__container">
      <h2 className="shoe-size-page__title">Shoe size</h2>
      <p className="shoe-size-page__desc">
        The indicated size has been provided by the seller. This is the size
        that appears on the item. Vestiaire Collective suggests the following
        conversion:
      </p>

      <Table
        className="shoe-size-page__table"
        dataSource={dataShoeSize}
        columns={columns}
        pagination={{ rootClassName: "shoe-size-page__table--pagination" }}
        bordered
        scroll={{
          x: "max-content",
        }}
      />
    </section>
  );
}

export default ShoezizePage;
