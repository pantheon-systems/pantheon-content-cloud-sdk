import { PantheonTreeNode } from "@pantheon-systems/pcc-sdk-core/types";
import React from "react";
import { ComponentMap, SmartComponentMap } from ".";
import { convertAttributes } from "../../utils/attributes";
import { getStyleObjectFromString } from "../../utils/styles";
import { withSmartComponentErrorBoundary } from "./SmartComponentErrorBoundary";

interface Props {
  element: PantheonTreeNode;
  smartComponentMap?: SmartComponentMap;
  componentMap?: ComponentMap;
  disableAllStyles?: boolean;
  preserveImageStyles?: boolean;
  disableDefaultErrorBoundaries?: boolean;
}

const PantheonTreeRenderer = ({
  element,
  smartComponentMap,
  componentMap,
  disableAllStyles,
  preserveImageStyles,
  disableDefaultErrorBoundaries,
}: Props): React.ReactElement | null => {
  const children =
    element.children?.map((child, idx) =>
      React.createElement(PantheonTreeRenderer, {
        key: idx,
        element: child,
        smartComponentMap,
        componentMap,
        disableAllStyles,
        preserveImageStyles,
        disableDefaultErrorBoundaries,
      }),
    ) ?? [];

  if (element.tag === "component") {
    const componentType = element.type?.toUpperCase();

    if (!componentType) {
      return null;
    }

    const component = smartComponentMap?.[componentType];

    if (component) {
      if (!component.reactComponent) {
        return (
          <div>
            Error: Cannot render {componentType} because it was provided without
            a reactComponent property.
          </div>
        );
      }

      return disableDefaultErrorBoundaries
        ? React.createElement(
            component.reactComponent,
            element.attrs as Record<string, unknown>,
          )
        : withSmartComponentErrorBoundary(component.reactComponent)(
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
  const convertedTagName = element.tag === "title" ? "h1" : element.tag;
  const componentOverride = componentMap?.[element.tag as "div"];
  const shouldPruneStyles =
    disableAllStyles === true &&
    (element.tag !== "img" || !preserveImageStyles) &&
    (typeof componentOverride === "string" || componentOverride == null);

  return React.createElement(
    componentOverride || convertedTagName,
    {
      style: shouldPruneStyles
        ? undefined
        : getStyleObjectFromString(element?.style),

      // If shouldPruneStyles, then overwrite the class
      // but leave other attrs intact.
      ...convertAttributes(
        Object.assign(
          {},
          element.attrs,
          shouldPruneStyles ? { class: null } : {},
        ),
      ),
    },
    nodeChildren.length ? nodeChildren : undefined,
  );
};

export default PantheonTreeRenderer;
