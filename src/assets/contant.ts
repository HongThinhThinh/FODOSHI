import fodoshi from "../../public/logo.svg";
import fodoshi_white from "../../public/logo-white.png";
import background from "../../public/Footer.png";
import banner from "../../public/image/frame.png";
import Malebanner from "../../public/image/male-banner.png";
import image8 from "../../public/image/image 8.png";
import social1 from "../../public/soical-card/Frame 2609149.png";
import social2 from "../../public/soical-card/Frame 2609149 (1).png";
import social3 from "../../public/soical-card/Frame 2609149 (2).png";
export const imageGirl = image8;
export const footerBackground = background;
export const bannerHomepage = banner;
export const bannerMalePage = Malebanner;
export const logo = fodoshi;
export const logoWhite = fodoshi_white;

export const navbar = [
  {
    path: "about",
    name: "Giới thiệu",
  },
  {
    path: "newProduct",
    name: "Hàng nhập mới",
  },
  {
    path: "brand",
    name: "Brand",
  },
  {
    path: "female",
    name: "Nữ",
  },
  {
    path: "male",
    name: "Nam",
  },
  {
    path: "shoeSize",
    name: "Bảng size giày",
  },
  {
    path: "blog",
    name: "Blog",
  },
];
type categoryType = {
  image: string;
  title: string;
};

export type DataTabType = {
  path: string;
  name: string;
};

export const category: categoryType[] = [
  {
    image:
      "https://www.cleanipedia.com/images/5iwkm8ckyw6v/p2e3c7e3V9nSuIIlfPdsW/1eb9893e6216a2066186d3db03c78cf8/MS05Ny5qcGc/1200w/qu%E1%BA%A7n-%C3%A1o-%C4%91%C6%B0%E1%BB%A3c-treo-g%E1%BB%8Dn-g%C3%A0ng-tr%C3%AAn-m%C3%B3c..jpg",
    title: "Quần áo",
  },
  {
    image:
      "https://file.hstatic.net/1000217270/article/_7e94ff26-49a1-4cbe-86b3-e421926cecbd_a66d686d728748b0a38596ab206a24ee.jpg",
    title: "Giày dép",
  },
  {
    image: "https://media.vneconomy.vn/w800/images/upload/2024/06/12/1x-1.jpg",
    title: "Túi xách",
  },
  {
    image: "https://blog.dktcdn.net/files/32-7778c.jpg",
    title: "Phụ kiện",
  },
];

export type ShowCardType = {
  id: number;
  type: string;
  image: string;
  name: string;
  size: number;
  price: number;
};

export const dataShoeSize = [
  { key: "1", EU: "37", KR: "220", UK: "3", US: "4", IT: "37" },
  { key: "2", EU: "37.5", KR: "225", UK: "3.5", US: "4.5", IT: "37.5" },
  { key: "3", EU: "38", KR: "230", UK: "4", US: "5", IT: "38" },
  { key: "4", EU: "38.5", KR: "235", UK: "4.5", US: "5.5", IT: "38.5" },
  { key: "5", EU: "39", KR: "240", UK: "5", US: "6", IT: "39" },
  { key: "6", EU: "39.5", KR: "245", UK: "5.5", US: "6.5", IT: "39.5" },
  { key: "7", EU: "40", KR: "250", UK: "6", US: "7", IT: "40" },
  { key: "8", EU: "40.5", KR: "255", UK: "6.5", US: "7.5", IT: "40.5" },
  { key: "9", EU: "41", KR: "260", UK: "7", US: "8", IT: "41" },
  { key: "10", EU: "41.5", KR: "265", UK: "7.5", US: "8.5", IT: "41.5" },
  { key: "11", EU: "42", KR: "270", UK: "8", US: "9", IT: "42" },
  { key: "12", EU: "42.5", KR: "275", UK: "8.5", US: "9.5", IT: "42.5" },
  { key: "13", EU: "43", KR: "280", UK: "9", US: "10", IT: "43" },
  { key: "14", EU: "43.5", KR: "285", UK: "9.5", US: "10.5", IT: "43.5" },
  { key: "15", EU: "44", KR: "290", UK: "10", US: "11", IT: "44" },
  { key: "16", EU: "44.5", KR: "295", UK: "10.5", US: "11.5", IT: "44.5" },
  { key: "17", EU: "45", KR: "300", UK: "11", US: "12", IT: "45" },
  { key: "18", EU: "45.5", KR: "305", UK: "11.5", US: "12.5", IT: "45.5" },
  { key: "19", EU: "46", KR: "310", UK: "12", US: "13", IT: "46" },
  { key: "20", EU: "46.5", KR: "315", UK: "12.5", US: "13.5", IT: "46.5" },
  { key: "21", EU: "47", KR: "320", UK: "13", US: "14", IT: "47" },
  { key: "22", EU: "47.5", KR: "325", UK: "13.5", US: "14.5", IT: "47.5" },
  { key: "23", EU: "48", KR: "330", UK: "14", US: "15", IT: "48" },
];

export const linkInfomation = [
  {
    path: "infomationPersonal",
    name: "thông tin cá nhân",
  },
  {
    path: "orderStatus",
    name: "Trạng thái đơn hàng",
  },
  {
    path: "deliveryAddress",
    name: "Địa chỉ giao hàng",
  },
  {
    path: "paymentMethod",
    name: "Phương thức thanh toán",
  },
  {
    path: "deposit/registration",
    name: "Ký gửi quần áo",
  },
  {
    path: "",
    name: "Tùy chọn tương tác",
  },
  {
    path: "",
    name: "Mã giảm giá",
  },
];

export const reasonCard = [
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdVA2l2F6HIuR9VpdBqKnANH6QOcDp7zFqzA&s",
    content: "Chất liệu thân thiện với môi trường",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdVA2l2F6HIuR9VpdBqKnANH6QOcDp7zFqzA&s",
    content: "Giá cả hợp lý, giao hàng nhanh chóng",
  },
  {
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdVA2l2F6HIuR9VpdBqKnANH6QOcDp7zFqzA&s",
    content: "Phong cách hiện đại, dễ phối đồ",
  },
];

export const socialCard = [
  {
    image: social1,
    title: "Tiktok",
    content: "Cập nhật những tips hay ho về thời gian bền vững cùng FODOSHI",
  },
  {
    image: social2,
    title: "Instagram",
    content: "Không bỏ lỡ bất kỳ sản phẩm mới nào",
  },
  {
    image: social3,
    title: "Thread",
    content: "Cùng chúng mình chia sẻ những câu chuyện",
  },
];
