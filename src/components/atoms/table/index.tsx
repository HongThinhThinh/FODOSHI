import React, { useState } from "react";
import styles from "./GenericTable.module.scss";

export interface ColumnType<T> {
  title: string;
  dataIndex?: keyof T; // Thuộc tính của object T
  key?: string;
  render?: (value: any, record: T) => React.ReactNode; // Hàm tùy chỉnh render
  align?: "left" | "center" | "right"; // Căn chỉnh cột
}

interface TableProps<T> {
  columns: ColumnType<T>[]; // Mảng các cột
  data: T[]; // Dữ liệu của bảng
  pageSize?: number;
  onRow?: (record: T) => void;
}

const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  pageSize = 5,
  onRow,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const handleChangePage = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  console.log(currentPage);
  return (
    <div className={styles["generic-table__wrapper"]}>
      <table className={styles["generic-table"]}>
        <thead className={styles["generic-table__header"]}>
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                style={{ textAlign: col.align || "left" }}
                className={styles["generic-table__header__cell"]}
              >
                <span>{col.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={styles["generic-table__row"]}
              onClick={() => onRow?.(row)}
              style={{ cursor: onRow ? "pointer" : "default" }}
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  style={{ textAlign: col.align || "left" }}
                  className={
                    colIndex === 0
                      ? styles["generic-table__row--highlight"]
                      : styles["generic-table__cell"]
                  }
                >
                  {col.render
                    ? col.render(row[col.dataIndex as keyof T], row)
                    : row[col.dataIndex as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles["pagination"]}>
        <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handleChangePage(index + 1)}
            className={
              currentPage === index + 1
                ? styles["pagination__button--active"]
                : styles["pagination__button"]
            }
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handleChangePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GenericTable;
