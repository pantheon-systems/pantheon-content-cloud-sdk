import { useState } from "react";

type Props = Omit<React.HTMLAttributes<HTMLButtonElement>, "children"> & {
  children: ((isHovered: boolean) => React.ReactNode) | React.ReactNode;
};

export const HoverButton = ({ children, style, ...props }: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
      style={style}
      {...props}
    >
      {typeof children === "function" ? children(isHovered) : children}
    </button>
  );
};
