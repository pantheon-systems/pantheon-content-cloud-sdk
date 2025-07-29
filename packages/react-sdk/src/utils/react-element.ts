import { isValidElement, PropsWithChildren, type ReactNode } from "react";

export const getTextContent = (node: ReactNode): string => {
  // Handle all possible types that ReactNode can be, since it is a union of types.
  if (node == null) {
    return "";
  } else if (
    typeof node === "string" ||
    typeof node === "number" ||
    typeof node === "bigint"
  ) {
    return node.toString();
  } else if (typeof node === "boolean") {
    return "";
  } else if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  } else if (isValidElement(node)) {
    return getTextContent((node.props as PropsWithChildren).children);
  }

  return "";
};
