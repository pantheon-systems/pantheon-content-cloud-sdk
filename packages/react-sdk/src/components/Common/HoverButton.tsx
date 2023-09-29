import { PropsWithChildren, useState } from "react";

export const HoverButton = ({
  children,
  style,
  ...props
}: PropsWithChildren<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
>) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      onMouseOver={() => setIsHover(true)}
      onFocus={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
      onBlur={() => setIsHover(false)}
      style={{
        opacity: isHover ? 0.8 : 1,
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
