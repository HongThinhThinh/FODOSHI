import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./styles.scss";
import { ReactNode } from "react";
interface CarouselProps extends SwiperProps {
  children: ReactNode;
}

function Carousel({ children, ...rest }: CarouselProps) {
  return <Swiper {...rest}>{children}</Swiper>;
}
Carousel.Item = SwiperSlide;

export default Carousel;
