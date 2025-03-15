/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import "./index.scss";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, UploadFile } from "antd";
import { message, Upload, Button, Select, Input, Modal } from "antd";
import ButtonComponent from "../../../atoms/button";
import useGetParams from "../../../../hooks/useGetParams";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toTitle } from "../../../../utils/formatStr";
import {
  useCreateProduct,
  useGetBrand,
  useGetCategory,
  useUpdateProduct,
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
  // Add navigate for "Back" button functionality
  const navigate = useNavigate();

  // Add the update product mutation
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  // Keep your existing code
  const { id } = useParams();
  // Check if we have a valid product ID that should trigger an API call
  const isValidProductId = id && !["products", "new", "undefined"].includes(id);

  const {
    data: productDetail,
    isLoading: isDetailLoading,
    error: detailError,
    refetch: refetchDetail,
  } = useGetProductDetail(id || "", {
    // Only enable the query when we have a valid product ID
    enabled: isValidProductId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Reuse the same logic for determining if we're in update mode
  const isUpdateMode = isValidProductId && !!productDetail;

  // Log for debugging
  useEffect(() => {
    console.log(id);
    if (detailError) {
      console.error("Error fetching product detail:", detailError);
    }
  }, [id, detailError]);

  // If we have an ID, but no detail yet, try refetching
  useEffect(() => {
    if (id && !productDetail && !isDetailLoading) {
      refetchDetail();
    }
  }, [id, productDetail, isDetailLoading, refetchDetail]);

  // Enhanced useEffect to set form data when product loads
  useEffect(() => {
    if (id && productDetail) {
      console.log("Product Detail:", productDetail);

      // Convert category and brand IDs from objects to string array
      const categoryIds = productDetail.categories?.map((cat) => cat.id) || [];
      const brandIds = productDetail.brands?.map((brand) => brand.id) || [];

      // Extract tags - log first to check structure
      console.log("Tags from API:", productDetail.tags);

      // Extract tag names properly
      const tagNames = productDetail.tags?.map((tag) => tag.tagName) || [];
      console.log("Extracted tag names:", tagNames);

      setProduct({
        name: productDetail.name || "",
        description: productDetail.description || "",
        category: categoryIds,
        brand: brandIds,
        condition: productDetail.productCondition || "",
        size: productDetail.size || "",
        color: productDetail.color || "#000000",
        gender: productDetail.gender || "",
        originalPrice: productDetail.originalPrice?.toString() || "",
        sellingPrice: productDetail.sellingPrice?.toString() || "",
        productStatus: productDetail.status || "AVAILABLE",
        tags: tagNames, // Make sure this is correctly passed as an array of strings
        imageUrls: productDetail.imageUrls?.map((img) => img.image) || [],
        consignorId: productDetail.consignor?.id || "",
        mainImage: productDetail.mainImage || "",
      });

      // Load existing images into the fileList for the Upload component
      if (productDetail.imageUrls && productDetail.imageUrls.length > 0) {
        const uploadFiles = productDetail.imageUrls.map((img, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: "done",
          url: img.image,
          thumbUrl: img.image,
        }));
        setFileList(uploadFiles);

        // Set the main image selection
        if (productDetail.mainImage) {
          const mainImageIndex = productDetail.imageUrls.findIndex(
            (img) => img.image === productDetail.mainImage
          );
          if (mainImageIndex >= 0) {
            setSelectedMainImage(mainImageIndex);
          }
        }
      }

      // Set consignor phone number if available
      if (productDetail.consignor?.phoneNumber) {
        setPhoneNumber(productDetail.consignor.phoneNumber);
      }
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

  // Modified handleSubmit to handle both create and update
  const handleSubmit = async () => {
    // Validation checks remain the same
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
      // Process images - only upload new ones
      const imageUrls: string[] = [];
      for (const file of fileList) {
        if (file.originFileObj) {
          // This is a new file that needs to be uploaded
          const downloadUrl = await uploadFile(file.originFileObj as File);
          imageUrls.push(downloadUrl);
        } else if (file.url) {
          // This is an existing image
          imageUrls.push(file.url);
        }
      }

      const productData = {
        ...product,
        originalPrice,
        sellingPrice,
        imageUrls,
        mainImage: imageUrls[selectedMainImage],
        productStatus: isConsigment ? "PENDING" : "AVAILABLE",
        consignorId: isConsigment ? user?.id : userByPhone?.id,
        // Send tags as simple strings
        tags: product.tags, // Already an array of strings
      };

      if (id !== "products") {
        setLoading(true);
        updateProduct(
          {
            id: id, // ID for URL path parameter
            data: productData, // Pass product data as a separate 'data' field
          },
          {
            onSuccess: () => {
              message.success("Cập nhật sản phẩm thành công!");
              // Consider navigating back or refreshing data after update
              // navigate(-1);
            },
            onError: (error) => {
              message.error("Có lỗi xảy ra khi cập nhật sản phẩm.");
              console.error(error);
            },
          }
        );
      } else {
        // Create new product
        mutate(productData, {
          onSuccess: () => {
            message.success("Thêm sản phẩm thành công!");
            // Reset form only for create, not for update
            resetForm();
          },
          onError: (error) => {
            message.error("Có lỗi xảy ra khi thêm sản phẩm.");
            console.error(error);
          },
        });
      }
    } catch (error) {
      message.error(
        id
          ? "Có lỗi xảy ra khi cập nhật sản phẩm."
          : "Có lỗi xảy ra khi thêm sản phẩm."
      );
    } finally {
      setLoading(false);
    }
  };

  // Add a reset form function
  const resetForm = () => {
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
      mainImage: "",
    });
    setFileList([]);
    setPhoneNumber("");
  };

  // Add this at the top of your component to track what's happening
  useEffect(() => {
    console.log("Current product state:", product);
    console.log("Current tags:", product.tags);
  }, [product]);

  // Add this to your API debugging
  useEffect(() => {
    if (productDetail) {
      console.log("Raw product detail from API:", productDetail);
      console.log("Raw tags from API:", productDetail.tags);
    }
  }, [productDetail]);

  // Add a useEffect to log the routing and mode information
  useEffect(() => {
    console.log({
      pathId: id,
      productDetail: !!productDetail,
      isUpdateMode,
      fullPath: window.location.pathname,
    });
  }, [id, productDetail, isUpdateMode]);

  return (
    <div className="productDetailPage">
      {loading && (
        <Modal
          className="customModal"
          footer={false}
          open={true}
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
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
                        <Option value="XXXL">Free Size</Option>
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
                  key={`tag-input-${product.tags.length}`} // Force re-render when tags change
                  initialTags={product.tags || []}
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
                <ButtonComponent
                  onClick={handleSubmit}
                  color="white"
                  children={isUpdateMode ? "Cập nhật" : "Thêm"}
                  bgColor={isUpdateMode ? "#D99041" : "#626a3f"}
                  className="w-1/3 h-[50px]"
                  loading={isPending || isUpdating}
                />

                <ButtonComponent
                  onClick={isUpdateMode ? () => navigate(-1) : resetForm}
                  color="#D99041"
                  children={isUpdateMode ? "Quay lại" : "Hủy"}
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
