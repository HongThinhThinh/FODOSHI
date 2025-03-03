/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import "./index.scss";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { message, Upload, Button, Select, Input, Modal } from "antd";
import ButtonComponent from "../../../atoms/button";
import useGetParams from "../../../../hooks/useGetParams";
import { Link } from "react-router-dom";
import { toTitle } from "../../../../utils/formatStr";
import {
  useCreateProduct,
  useGetBrand,
  useGetCategory,
} from "../../../../services/adminService";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../config/firebase";
import ProductSwiper from "./productSwiper";
import TagInput from "./TagInput"; // Import the TagInput component
import { useGetUserByPhone } from "../../../../services/useUserService";
import LoadingUI from "../../../atoms/loading";
import { useSelector } from "react-redux";
import { useGetProductDetail } from "../../../../services/productService";

const { Option } = Select;

// Firebase upload helper function
const uploadFile = async (file: File) => {
  const storageRef = ref(storage, `products/${file.name}`);
  const response = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(response.ref);
  return downloadURL;
};

interface ProductDetailProps {
  product_id?: string;
  isHidding?: boolean;
  isConsigment?: boolean;
  isCustomWidth?: boolean; // Thêm prop này
}

export default function ProductDetail({
  product_id,
  isHidding = false,
  isConsigment = false,
  isCustomWidth = false,
}: ProductDetailProps) {
  const params = useGetParams();
  const id = params("id");
  const {
    data: productDetail,
    isLoading,
    error,
  } = useGetProductDetail(id || "");

  useEffect(() => {
    if (id && productDetail) {
      console.log("Product Detail:", productDetail);
    }
  }, [id, productDetail]);
  const getCategory = useGetCategory("");
  const getBrand = useGetBrand("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const user = useSelector((store) => store?.user);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: [] as string[],
    brand: [] as string[],
    condition: "",
    size: "",
    color: "#000000", // New field for color
    gender: "", // New field for gender
    originalPrice: "",
    sellingPrice: "",
    productStatus: "AVAILABLE",
    tags: [] as string[], // Use tags array from state
    imageUrls: [] as string[],
    consignorId: "",
    mainImage: "",
  });
  const [loading, setLoading] = useState(false);
  const currentPath = location.pathname.split("/")[2];
  const currentSubPath = location.pathname.split("/")[3];
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedMainImage, setSelectedMainImage] = useState<number>(0);
  const { data: userByPhone, refetch } = useGetUserByPhone(phoneNumber);
  useEffect(() => {
    setSelectedMainImage(0);
  }, [fileList]);
  useEffect(() => {
    if (phoneNumber) {
      refetch();
    }
  }, [phoneNumber, refetch]);

  console.log(userByPhone?.id);
  const { mutate, isPending } = useCreateProduct();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string[], name: "category" | "brand") => {
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct((prev) => ({ ...prev, color: e.target.value }));
  };

  const handleGenderChange = (value: string) => {
    setProduct((prev) => ({ ...prev, gender: value }));
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
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một ảnh.");
      return;
    }
    const originalPrice = parseFloat(product.originalPrice);
    const sellingPrice = parseFloat(product.sellingPrice);
    if (isNaN(originalPrice) || isNaN(sellingPrice)) {
      message.error("Giá gốc và giá bán phải là số.");
      return;
    }

    try {
      setLoading(true);
      const imageUrls: string[] = [];
      for (const file of fileList) {
        if (file.originFileObj) {
          const downloadUrl = await uploadFile(file.originFileObj as File);
          imageUrls.push(downloadUrl);
        }
      }

      mutate(
        {
          ...product,
          originalPrice,
          sellingPrice,
          imageUrls,
          mainImage: imageUrls[selectedMainImage],
          productStatus: isConsigment ? "PENDING" : "AVAILABLE",
          consignorId: isConsigment ? user?.id : userByPhone?.id,
        },

        {
          onSuccess: () => {
            message.success("Thêm sản phẩm thành công!");
            // Reset form fields after successful submission
            setProduct({
              name: "",
              description: "",
              category: [],
              brand: [],
              condition: "",
              size: "",
              color: "#000000",
              gender: "UNISEX",
              originalPrice: "",
              sellingPrice: "",
              productStatus: "AVAILABLE",
              tags: [],
              imageUrls: [],
              consignorId: "",
            });
            setFileList([]); // Clear file list after success
            setPhoneNumber("");
          },
          onError: (error) => {
            message.error("Có lỗi xảy ra khi thêm sản phẩm.");
            console.error(error); // Optionally log the error for debugging
          },
        }
      );
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="productDetailPage">
      {loading && (
        <Modal className="customModal" footer={false} open={true}>
          <LoadingUI />
        </Modal>
      )}
      <div className={`${isCustomWidth ? "w-[1000px]" : "w-[1200px]"}`}>
        {!isHidding && (
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
        )}
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
                  {getCategory.data?.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
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
                  {getBrand?.data?.map((option) => (
                    <Option key={option.id} value={option.id}>
                      {option.name}
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
                  <div className="form-item rounded-lg">
                    <label htmlFor="color" className="block">
                      <b>Màu sắc</b>
                    </label>
                    <Input
                      type="color"
                      name="color"
                      value={product.color}
                      onChange={handleColorChange}
                      className="w-full"
                    />
                  </div>
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
                <div className="flex items-center gap-4">
                  <div className="w-1/2">
                    <div className="form-item">
                      <label htmlFor="size" className="block">
                        <b>Kích cỡ</b>
                      </label>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn kích cỡ"
                        value={product.size}
                        onChange={(value) => handleSelectChange(value, "size")}
                      >
                        <Option value="XS">XS</Option>
                        <Option value="S">S</Option>
                        <Option value="M">M</Option>
                        <Option value="L">L</Option>
                        <Option value="XL">XL</Option>
                        <Option value="XXL">XXL</Option>
                        <Option value="XXXL">XXXL</Option>
                      </Select>
                    </div>
                  </div>
                  <div className="w-1/2">
                    <div className="form-item">
                      <label htmlFor="gender" className="block ">
                        <b>Dành cho</b>
                      </label>
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Chọn giới tính"
                        value={product.gender}
                        onChange={handleGenderChange}
                      >
                        <Option value="MALE">Male</Option>
                        <Option value="FEMALE">Female</Option>
                        <Option value="UNISEX">Unisex</Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              {!isConsigment && (
                <div className="w-full">
                  <div className="form-item">
                    <label htmlFor="consignorPhone" className="block">
                      <b>SDT chủ kí gửi</b>
                    </label>
                    <Input
                      type="text"
                      name="consignorPhone"
                      value={phoneNumber}
                      onChange={(e: any) => setPhoneNumber(e.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  {userByPhone && (
                    <div className="customer-info mt-4">
                      <div>
                        <b>Tên khách hàng:</b> {userByPhone.name}
                      </div>
                      <div>
                        <b>Email:</b> {userByPhone.email || "Chưa có email"}
                      </div>
                      {/* <div>
                          <b>Địa chỉ:</b>{" "}
                          {userByPhone.address || "Chưa có địa chỉ"}
                        </div> */}
                    </div>
                  )}
                </div>
              )}
              <div className="w-full ">
                <label className="block font-bold mb-2">Tag</label>
                <TagInput
                  initialTags={product.tags}
                  onChange={(newTags) =>
                    setProduct((prev) => ({ ...prev, tags: newTags }))
                  }
                />
              </div>
            </div>

            <div className="product-detail__form-right overflow-hidden">
              <ProductSwiper
                fileList={fileList}
                onImageSelect={(index) => setSelectedMainImage(index)}
                selectedMainImage={selectedMainImage}
              />

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
    </div>
  );
}
