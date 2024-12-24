import React, { useState } from "react";
import "./index.scss";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { message, Upload, Image, Modal, Button } from "antd";
import ButtonComponent from "../../../atoms/button";
const { Dragger } = Upload;

interface ProductDetailProps {
  product_id: string;
}

export default function ProductDetail({ product_id }: ProductDetailProps) {
  const [tags, setTags] = useState(["Lorem", "Lorem"]);

  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "0",
      name: "xxx.png",
      status: "uploading",
      percent: 33,
    },
    {
      uid: "-1",
      name: "yyy.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
      thumbUrl:
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "zzz.png",
      status: "error",
    },
  ]);
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

  const fetchProductById = async () => {};

  const props: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  // const props: UploadProps = {
  //   name: "file",
  //   multiple: true,
  //   action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
  //   fileList,
  //   onChange(info) {
  //     setFileList(info.fileList); // Update the fileList
  //     const { status } = info.file;
  //     if (status !== "uploading") {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (status === "done") {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === "error") {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
  //   onPreview: async (file) => {
  //     if (!file.url && !file.preview) {
  //       file.preview = await new Promise<string>((resolve, reject) => {
  //         const reader = new FileReader();
  //         reader.readAsDataURL(file.originFileObj as Blob);
  //         reader.onload = () => resolve(reader.result as string);
  //         reader.onerror = (error) => reject(error);
  //       });
  //     }

  //     setPreviewImage(file.url || (file.preview as string));
  //     setPreviewTitle(
  //       file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
  //     );
  //     setPreviewOpen(true);
  //   },
  //   onDrop(e) {
  //     console.log("Dropped files", e.dataTransfer.files);
  //   },
  // };
  return (
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
          <div className="w-full h-1/3 bg-gray-300 rounded mb-6">
            <div className=""></div>
          </div>

          <div className="form-item">
            <label htmlFor="">
              <b>Thư viện ảnh</b>
            </label>
            <Upload
              action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
              listType="picture"
              defaultFileList={fileList}
            >
              <Button icon={<UploadOutlined />} className="upload-btn">
                Upload product's image
              </Button>
            </Upload>
          </div>

          <div className="flex gap-4 mt-24">
            <ButtonComponent
              color="white"
              children="Cập nhật"
              bgColor="#D99041"
              className="w-1/3 h-[50px]"
            />
            <ButtonComponent
              color="white"
              children="Xóa"
              bgColor="#626A3F"
              className="w-1/3 h-[50px]"
            />

            <ButtonComponent
              color="#D99041"
              children="Hủy"
              className="w-1/3 h-[50px]"
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
  );
}
