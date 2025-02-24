import React, { useState } from "react";
import "./index.scss";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { message, Upload, Button, Select } from "antd";
import ButtonComponent from "../../../atoms/button";
import useGetParams from "../../../../hooks/useGetParams";
import { Link } from "react-router-dom";
import { toTitle } from "../../../../utils/formatStr";
import { useCreateProduct } from "../../../../services/adminService";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../config/firebase";
import ProductSwiper from "./productSwiper";
const { Option } = Select;

// Firebase upload helper function
const uploadFile = async (file: File) => {
  const storageRef = ref(storage, `products/${file.name}`);
  const response = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};

interface ProductDetailProps {
  product_id: string;
}

export default function ProductDetail({ product_id }: ProductDetailProps) {
  const params = useGetParams();
  const id = params("id");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: [] as string[],
    brand: [] as string[],
    condition: "",
    size: "",
    originalPrice: "",
    sellingPrice: "",
    productStatus: "ACTIVE",
    tags: [] as string[],
    imageUrls: [] as string[],
    consignorId: 1,
  });

  const currentPath = location.pathname.split("/")[2];
  const currentSubPath = location.pathname.split("/")[3];
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Category and brand options
  const categoryOptions = [
    { value: "sneakers", label: "Sneakers" },
    { value: "apparel", label: "Apparel" },
    { value: "electronics", label: "Electronics" },
  ];

  const brandOptions = [
    { value: "nike", label: "Nike" },
    { value: "adidas", label: "Adidas" },
    { value: "puma", label: "Puma" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string[], name: "category" | "brand") => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value.trim();

    if (e.key === "Enter" && value && !product.tags.includes(value)) {
      setProduct((prevProduct) => ({
        ...prevProduct,
        tags: [...prevProduct.tags, value],
      }));
      (e.target as HTMLInputElement).value = "";
    }
  };

  const removeTag = (index: number) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      tags: prevProduct.tags.filter((_, i) => i !== index),
    }));
  };

  const createProduct = useCreateProduct();

  const props: UploadProps = {
    name: "file",
    multiple: true,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      const isLt2M = file.size / 1024 / 1024 < 2;

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
    onChange: (info) => {
      setFileList(info.fileList);
    },
  };

  const handleSubmit = async () => {
    if (
      !product.name ||
      !product.description ||
      product.category.length === 0
    ) {
      message.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    const originalPrice = parseFloat(product.originalPrice);
    const sellingPrice = parseFloat(product.sellingPrice);

    if (isNaN(originalPrice) || isNaN(sellingPrice)) {
      message.error("Giá gốc và giá bán phải là số.");
      return;
    }

    try {
      const imageUrls: string[] = [];
      for (const file of fileList) {
        if (file.originFileObj) {
          const downloadUrl = await uploadFile(file.originFileObj as File);
          imageUrls.push(downloadUrl);
        }
      }

      createProduct.mutate({
        ...product,
        originalPrice,
        sellingPrice,
        imageUrls,
      });

      message.success("Thêm sản phẩm thành công!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm sản phẩm.");
    }
  };

  return (
    <div className="w-[1200px]">
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
            {/* Form fields remain the same */}
            <div className="form-item">
              <label htmlFor="" className="block ">
                <b>Tên sản phẩm</b>
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 rounded"
              />
            </div>

            <div className="form-item">
              <label htmlFor="" className="block ">
                <b>Mô tả</b>
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-700 rounded"
                placeholder="..."
                rows={5}
              ></textarea>
            </div>

            <div className="form-item">
              <label htmlFor="category" className="block">
                <b>Danh mục</b>
              </label>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Chọn danh mục"
                value={product.category}
                onChange={(value) => handleSelectChange(value, "category")}
              >
                {categoryOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="form-item">
              <label htmlFor="brand" className="block">
                <b>Brand</b>
              </label>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Chọn thương hiệu"
                value={product.brand}
                onChange={(value) => handleSelectChange(value, "brand")}
              >
                {brandOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>

            <div className="flex gap-4">
              <div className="w-1/2 form-item">
                <label htmlFor="" className="block ">
                  <b>Tình trạng</b>
                </label>
                <input
                  type="text"
                  name="condition"
                  value={product.condition}
                  onChange={handleInputChange}
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
                  name="size"
                  value={product.size}
                  onChange={handleInputChange}
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
                  name="originalPrice"
                  value={product.originalPrice}
                  onChange={handleInputChange}
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
                  name="sellingPrice"
                  value={product.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="10000000"
                  className="w-full px-3 py-2 border border-gray-700 rounded"
                />
              </div>
            </div>

            <div className="form-item">
              <label className="block font-bold mb-2">Tag</label>
              <div className="border border-gray-300 rounded p-3 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
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

          <div className="product-detail__form-right overflow-hidden">
            {/* Use the new ProductSwiper component */}
            <ProductSwiper fileList={fileList} />

            <div className="form-item">
              <label htmlFor="">
                <b>Thư viện ảnh</b>
              </label>
              <Upload {...props} listType="picture" fileList={fileList}>
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
                  onClick={handleSubmit}
                  color="white"
                  children="Thêm"
                  bgColor="#626a3f"
                  className="w-1/3 h-[50px]"
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
      </div>
    </div>
  );
}
