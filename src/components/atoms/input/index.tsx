import { Input, InputProps } from "antd";
import "./styles.scss";

interface InputComponentProps extends InputProps {
  className?: string;
  bgColor?: number | string | undefined;
  width?: number | string | undefined;
  height?: number | string | undefined;
  shape?: "round" | "primary";
}

// Component chính
function InputComponent({
  className,
  bgColor,
  shape = "primary",
  width,
  height,
  ...rest
}: InputComponentProps) {
  return (
    <Input
      className={`input-fodoshi ${className}`}
      {...rest}
      style={{
        "--bg-color": bgColor,
        "--border-radius": shape === "primary" ? "6px" : "15px",
        "--width": width,
        "--height": height,
      }}
    />
  );
}

// Thêm thuộc tính Password
InputComponent.Password = ({
  className,
  bgColor,
  width,
  height,
  shape = "primary",
  ...rest
}: InputComponentProps) => (
  <Input.Password
    className={`input-fodoshi ${className}`}
    {...rest}
    style={{
      "--bg-color": bgColor,
      "--border-radius": shape === "primary" ? "6px" : "15px",
      "--width": width,
      "--height": height,
    }}
  />
);

export default InputComponent;
