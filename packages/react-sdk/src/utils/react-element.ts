export const getTextContent = (node: React.ReactNode): string => {
  // Handle all possible types that ReactNode can be, since it is a union of types.
  if (node == null) {
    return "";
  } else if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  } else if (typeof node === "boolean") {
    return "";
  } else if (Array.isArray(node)) {
    return node.map(getTextContent).join("");
  } else if ("props" in node) {
    return (node.props.children || node.props.element?.children || [])
      .map(getTextContent)
      .join("");
  }

  return "";
};
