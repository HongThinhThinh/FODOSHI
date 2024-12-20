import { Button, ButtonProps } from "antd";
import "./styles.scss";
interface ButtonComponentProps extends ButtonProps {
  className?: string;
  color?: string;
  bgColor?: string;
}
function ButtonComponent({
  className,
  bgColor,
  color,
  ...rest
}: ButtonComponentProps) {
  return (
    <Button
      className={`button-fodoshi ${className}`}
      {...rest}
      style={{ "--bg-color": bgColor, "--color": color }}
    />
  );
}

export default ButtonComponent;
