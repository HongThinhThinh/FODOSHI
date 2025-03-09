import { Button, ButtonProps } from "antd";
import "./styles.scss";
interface ButtonComponentProps extends ButtonProps {
  className?: string;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  isActive?: boolean;
  isSubmit?: boolean;
  status?: "default" | "danger" | "success" | "warning" | "info" | "disabled";
}
function ButtonComponent({
  className,
  bgColor,
  color,
  children,
  isSubmit,
  isActive,
  status = "default",
  ...rest
}: ButtonComponentProps) {
  return (
    <Button
      htmlType={isSubmit ? "submit" : "button"}
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
