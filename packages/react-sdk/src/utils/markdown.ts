import { Element, Text } from "hast";

export const retrieveTextValue = (node: Element | Text): string | null => {
  if (node.type === "text" && node.value) return node.value as string;
  else if (node.type === "element") {
    for (const i of node.children || []) return retrieveTextValue(i as Element);
  }
  return null;
};
