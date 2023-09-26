import { PropsWithChildren, useState } from "react";

export const HoverButton = ({
  children,
  style,
  ...props
}: PropsWithChildren<any>) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
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
