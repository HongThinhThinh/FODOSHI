import { Card } from "antd";
import { FC } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface CustomizedCardProps {
  /** What tailwind class want to use for customizing card? */
  styleClass?: string;
  /** Card's customized background */
  background?: string;
  /** Rendering  */
  loading?: boolean;
  /** Card contents */
  children?: React.ReactNode;
  width: string | number;
  height: string | number;
}

const CustomizedCard: FC<CustomizedCardProps> = ({
  styleClass,
  background,
  loading,
  children,
  width,
  height,
  ...props
}) => {
  return loading ? (
    <Skeleton height={height || "100%"} width={width || "100%"} className="rounded-2xl" />
  ) : (
    <Card
      className={[`w-full h-full bg-cover`, styleClass].join(" ")}
      style={{ backgroundImage: background, width: width || "100%", height: height || "100%" }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default CustomizedCard;
