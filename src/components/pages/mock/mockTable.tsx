import React from "react";
import GenericTable, { ColumnType } from "../../atoms/table";

export default function MockTablePage() {
  interface UserData {
    id: number;
    name: string;
    age: number;
    address: string;
  }

  const columns: ColumnType<UserData>[] = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (value: string) => <span>{value}</span>, // Tùy chỉnh render
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
    },
  ];

  const data: UserData[] = [
    { id: 1, name: "John Doe", age: 30, address: "New York" },
    { id: 2, name: "Jane Smith", age: 25, address: "London" },
    { id: 3, name: "Bob Johnson", age: 35, address: "Sydney" },
  ];

  return (
    <div>
      <GenericTable columns={columns} data={data}></GenericTable>
    </div>
  );
}
