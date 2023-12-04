import crypto from "crypto";
import * as _ from "lodash";
import React from "react";
import type { ReactMarkdownProps } from "react-markdown/lib/complex-types";
import { ReactMarkdown } from "react-markdown/lib/react-markdown.js";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import type { UnistParent } from "unist-util-visit/lib";
import type { Components, SmartComponentMap } from ".";

interface MarkdownRendererProps {
  children: string;
  smartComponentMap?: SmartComponentMap;
  componentsMap?: Components;
}

const retrieveValue = (node: any): string | null => {
  if (node.value) return node.value as string;
  for (const i of node.children || []) return retrieveValue(i);
  return null;
};

const generateUniqueIds = () => {
  const ids = new Set();
  return (value: string) => {
    let result = _.kebabCase(value);
    if (ids.has(result)) {
      result = `${result}-${crypto.randomBytes(3).toString("hex")}`;
      ids.add(result);
    } else {
      ids.add(result);
    }
    return result;
  };
};

const HeaderWithId = (props: ReactMarkdownProps) => {
  const { node, children } = props;
  const { tagName, properties } = node;
  const generateId = generateUniqueIds();
  const title = retrieveValue(node);
  return React.createElement(
    tagName,
    {
      ...properties,
      id: generateId(title || ""),
    },
    children,
  );
};

interface ComponentProperties {
  attrs: string;
  id: string;
  type: string;
}

const MarkdownRenderer = ({
  children,
  smartComponentMap,
}: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw, fixComponentParentRehypePlugin]}
      components={{
        h1: HeaderWithId,
        h2: HeaderWithId,
        h3: HeaderWithId,
        h4: HeaderWithId,
        h5: HeaderWithId,
        h6: HeaderWithId,
        ["pcc-component" as "div"]: ({ node }: ReactMarkdownProps) => {
          const { attrs, id, type } =
            node.properties as typeof node.properties & ComponentProperties;

          if (smartComponentMap && smartComponentMap[type]) {
            const { reactComponent: Component } = smartComponentMap[type];
            const decodedAttrs = isomorphicBase64Decode(attrs);

            return (
              <div>
                <Component key={id} {...decodedAttrs} />
              </div>
            );
          }

          return (
            <div className="pcc-component">
              <u>PCC Component - {type}</u>
            </div>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

function isomorphicBase64Decode(str: string): Record<string, unknown> {
  try {
    let stringifiedJSON: string | undefined;
    if (typeof Buffer !== "undefined") {
      stringifiedJSON = Buffer.from(str, "base64").toString("utf8");
    } else if (typeof atob !== "undefined") {
      stringifiedJSON = atob(str);
    }

    if (!stringifiedJSON) throw new Error("Failed to decode base64 string");

    return JSON.parse(stringifiedJSON);
  } catch (e) {
    console.error(e);
    return {};
  }
}

/**
 * Rehype plugin to set the parent of a pcc-component node to a div
 * to fix hydration errors from the component being nested in an invalid parent.
 */
function fixComponentParentRehypePlugin() {
  return (tree: UnistParent) => {
    visit(
      tree,
      { type: "element", tagName: "pcc-component" },
      (node, _, parent) => {
        if (
          parent &&
          "tagName" in parent &&
          // @ts-expect-error TODO: Type this properly
          parent.tagName !== "div"
        ) {
          // @ts-expect-error TODO: Type this properly
          parent.tagName = "div";
        }
      },
    );
  };
}

export default MarkdownRenderer;
