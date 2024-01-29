import { PantheonTreeNode } from "@pantheon-systems/pcc-sdk-core/types";
import React from "react";
import { ComponentMap, SmartComponentMap } from ".";
import { convertAttributes } from "../../utils/attributes";
import { getStyleObjectFromString } from "../../utils/styles";

interface Props {
  element: PantheonTreeNode;
  smartComponentMap?: SmartComponentMap;
  componentMap?: ComponentMap;
  disableAllStyles?: boolean;
}

const PantheonTreeRenderer = ({
  element,
  smartComponentMap,
  componentMap,
  disableAllStyles,
}: Props): React.ReactElement | null => {
  const children =
    element.children?.map((child, idx) =>
      React.createElement(PantheonTreeRenderer, {
        key: idx,
        element: child,
        smartComponentMap,
        componentMap,
        disableAllStyles,
      }),
    ) ?? [];

  if (element.tag === "component") {
    const componentType = element.type?.toUpperCase();

    if (!componentType) {
      return null;
    }

    const component = smartComponentMap?.[componentType];

    if (component) {
      return React.createElement(
        component.reactComponent,
        element.attrs as Record<string, unknown>,
      );
    }
  }

  if (element.tag === "style") {
    if (disableAllStyles) return null;

    // `renderToStaticMarkup` will escape the HTML entities in the style tag
    // https://github.com/facebook/react/issues/13838#issuecomment-470294454
    return React.createElement("style", {
      dangerouslySetInnerHTML: {
        __html: element.data,
      },
    });
  }

  const nodeChildren = [element.data, ...children].filter(Boolean);
  return React.createElement(
    componentMap?.[element.tag as "div"] || element.tag,
    {
      style:
        disableAllStyles === true
          ? undefined
          : getStyleObjectFromString(element?.style),
      ...convertAttributes(element.attrs),
    },
    nodeChildren.length ? nodeChildren : undefined,
  );
};

export default PantheonTreeRenderer;
