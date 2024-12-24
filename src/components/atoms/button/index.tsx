import { Button, ButtonProps } from "antd";
import "./styles.scss";
interface ButtonComponentProps extends ButtonProps {
  className?: string;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
  isActive?: boolean;
}
function ButtonComponent({
  className,
  bgColor,
  color,
  children,
  isActive,
  ...rest
}: ButtonComponentProps) {
  return (
    <Button
      className={`button-fodoshi ${className} ${isActive ? "active" : ""}`}
      {...rest}
      style={{ "--bg-color": isActive ? "#d99041" : bgColor, "--color": isActive ? "#ffff"  : color }}
    >
      {children}
    </Button>
  );
}

export default ButtonComponent;
