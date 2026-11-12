import type { ButtonHTMLAttributes } from "react";

interface ButtonToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onToggle?: () => void;
}

const Button = ({
  className,
  onToggle,
  children,
  type = "button",
  ...props
}: ButtonToggleProps) => {
  return (
    <button
      type={type}
      onClick={onToggle}
      className={`cursor-pointer ${className} `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;