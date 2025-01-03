import { Button, ButtonProps } from "antd";
import "./styles.scss";
import { ButtonShape } from "antd/es/button";
interface ButtonComponentProps extends ButtonProps {
  className?: string;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  status?: "default" | "danger" | "success" | "warning" | "info" | "disabled";
}
function ButtonComponent({
  className,
  bgColor,
  color,
  children,
  isActive,
  status = "default",
  ...rest
}: ButtonComponentProps) {
  return (
    <Button
      className={`button-fodoshi ${className} ${
        isActive ? "active" : ""
      } btn-sign-status-${status}`}
      {...rest}
      style={{
        "--bg-color": isActive ? "#d99041" : bgColor,
        "--color": isActive ? "#ffff" : color,
      }}
    >
      {children}
    </Button>
  );
}

export default ButtonComponent;
