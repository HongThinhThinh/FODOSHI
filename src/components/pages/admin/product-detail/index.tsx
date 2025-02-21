/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import "./index.scss";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { message, Upload, Image, Button } from "antd";
import ButtonComponent from "../../../atoms/button";
import useGetParams from "../../../../hooks/useGetParams";
import { Link } from "react-router-dom";
import { toTitle } from "../../../../utils/formatStr";
const { Dragger } = Upload;

interface ProductDetailProps {
  product_id: string;
}

export default function ProductDetail({ product_id }: ProductDetailProps) {
  const [tags, setTags] = useState(["Lorem", "Lorem"]);
  const params = useGetParams();
  const id = params("id");
  // const [fileList, setFileList] = useState<UploadFile[]>([
  //   {
  //     uid: "0",
  //     name: "xxx.png",
  //     status: "uploading",
  //     percent: 33,
  //   },
  //   {
  //     uid: "-1",
  //     name: "yyy.png",
  //     status: "done",
  //     url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //     thumbUrl:
  //       "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //   },
  //   {
  //     uid: "-2",
  //     name: "zzz.png",
  //     status: "error",
  //   },
  // ]);
  const currentPath = location.pathname.split("/")[2];
  const currentSubPath = location.pathname.split("/")[3];
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter" && value) {
      setTags([...tags, value]);
      (e.target as HTMLInputElement).value = "";
    }
  };

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchProductById = async () => {};
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2; // Kiểm tra dung lượng file

      if (!isImage) {
        message.error("Chỉ hỗ trợ file hình ảnh!");
        return Upload.LIST_IGNORE;
      }
      if (!isLt2M) {
        message.error("File quá lớn! (Tối đa 2MB)");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: async (info) => {
      const { file } = info;

      if (file.status === "done" || file.originFileObj) {
        try {
          const imageUrl = await getBase64(file.originFileObj as File);
          setBackgroundImage(imageUrl); // Cập nhật ảnh nền
        } catch (error) {
          message.error("Lỗi khi hiển thị ảnh.");
        }
      } else if (file.status === "error") {
        message.error(`${file.name} tải lên thất bại.`);
      }
    },
  };
  return (
    <>
      <div>
        <h1 style={{ fontWeight: "600", fontSize: "24px" }}>
          Thêm sản phẩm mới
        </h1>
        <h3>
          <Link to="/">Trang chủ</Link>
          {" > "}
          <Link to={`${currentPath}`}>{toTitle(currentPath)}</Link>
          {currentSubPath ? (
            <>
              {" > "}
              <Link to={`categories/${currentSubPath}`}>
                {toTitle(currentSubPath)}
              </Link>
            </>
          ) : (
            ""
          )}
        </h3>
      </div>
      <div className="product-detail">
        <form action="" className="product-detail__form">
          <div className="product-detail__form-left">
            <div className="form-item">
              <label htmlFor="" className="block ">
                <b>Tên sản phẩm</b>
              </label>
              <input
                type="text"
                placeholder="..."
                className="w-full px-3 py-2 border border-gray-700 rounded"
              />
            </div>

            <div className="form-item">
              <label htmlFor="" className="block ">
                <b>Mô tả</b>
              </label>
              <textarea
                name=""
                id=""
                className="w-full px-3 py-2 border border-gray-700 rounded"
                placeholder="..."
                rows={5}
              ></textarea>
            </div>

            <div className="form-item">
              <label htmlFor="" className="block ">
                <b>Danh mục</b>
              </label>
              <input
                type="text"
                placeholder="Sneaker"
                className="w-full px-3 py-2 border border-gray-700 rounded"
              />
            </div>

            <div className="form-item">
              <label htmlFor="" className="block ">
                <b>Brand</b>
              </label>
              <input
                type="text"
                placeholder="Adidas"
                className="w-full px-3 py-2 border border-gray-700 rounded"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 form-item">
                <label htmlFor="" className="block ">
                  <b>Tình trạng</b>
                </label>
                <input
                  type="text"
                  placeholder="Very good"
                  className="w-full px-3 py-2 border border-gray-700 rounded"
                />
              </div>

              <div className="w-1/2 form-item">
                <label htmlFor="" className="block ">
                  <b>Kích cỡ</b>
                </label>
                <input
                  type="text"
                  placeholder="35"
                  className="w-full px-3 py-2 border border-gray-700 rounded"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 form-item">
                <label htmlFor="" className="block ">
                  <b>Giá gốc</b>
                </label>
                <input
                  type="text"
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-700 rounded"
                />
              </div>

              <div className="w-1/2 form-item">
                <label htmlFor="" className="block ">
                  <b>Giá bán</b>
                </label>
                <input
                  type="text"
                  placeholder="10000000"
                  className="w-full px-3 py-2 border border-gray-700 rounded"
                />
              </div>
            </div>

            <div className="form-item">
              <label className="block font-bold mb-2">Tag</label>
              <div className="border border-gray-300 rounded p-3 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-800 text-white text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-white"
                      onClick={() => removeTag(index)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  placeholder="Add tag"
                  onKeyDown={addTag}
                  className="flex-grow outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="product-detail__form-right">
            <div
              className="w-full h-[370px] rounded mb-6 transition-all duration-300"
              style={{
                background: backgroundImage
                  ? `url(${backgroundImage}) center/contain no-repeat`
                  : "linear-gradient(to right, #e0e0e0, #f5f5f5)",
                border: backgroundImage ? "none" : "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {!backgroundImage && <p className="text-gray-600">Chưa có ảnh</p>}
            </div>

            <div className="form-item">
              <label htmlFor="">
                <b>Thư viện ảnh</b>
              </label>
              <Upload
                {...props}
                listType="picture"
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                defaultFileList={fileList}
              >
                <Button icon={<UploadOutlined />} className="upload-btn">
                  Upload product's image
                </Button>
              </Upload>
            </div>

            <div className="flex gap-4 mt-24 justify-center ">
              {id != null ? (
                <ButtonComponent
                  color="white"
                  children="Cập nhật"
                  bgColor="#D99041"
                  className="w-1/3 h-[50px]"
                />
              ) : (
                <ButtonComponent
                  color="white"
                  children="Thêm"
                  bgColor="#626a3f"
                  className="w-1/3 h-[50px]"
                />
              )}

              {id != null && (
                <ButtonComponent
                  color="white"
                  children="Xóa"
                  bgColor="#626A3F"
                  className="w-1/3 h-[50px] "
                />
              )}
              <ButtonComponent
                color="#D99041"
                children="Hủy"
                className="w-1/3 h-[50px] text-black border border-black"
              />
            </div>
          </div>
        </form>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>
    </>
  );
}
