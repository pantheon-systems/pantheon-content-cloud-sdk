import {
  Article,
  TreePantheonContent,
} from "@pantheon-systems/pcc-sdk-core/types";
import { defineComponent, h, PropType, SlotsType } from "vue-demi";
import MarkdownRenderer from "./MarkdownRenderer";
import TopLevelElement from "./TopLevelElement";

export type JSONElement = {
  tag: string;
  data?: string;
  children?: JSONElement[];
  src?: string;
  alt?: string;
  style?: string[];
  title?: string;
  href?: string;
  type?: string;
  attrs?: Record<string, string>;
};

const Renderer = defineComponent({
  name: "Renderer",
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
  },
  slots: Object as SlotsType<{
    titleRenderer: {
      title: string | undefined;
    };
  }>,
  setup(props, { slots }) {
    const { article } = props;

    if (article.contentType === "TEXT_MARKDOWN") {
      return () =>
        h(MarkdownRenderer, {
          source: article.content || "",
          options: {
            html: true,
          },
        });
    }

    const parsedBody: TreePantheonContent[] = article?.content
      ? JSON.parse(article.content)
      : [];
    const indexOfFirstHeader = parsedBody.findIndex((x) =>
      ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "title"].includes(x.tag),
    );

    const indexOfFirstParagraph = parsedBody.findIndex((x) => x.tag === "p");
    const resolvedTitleIndex =
      indexOfFirstHeader === -1 ? indexOfFirstParagraph : indexOfFirstHeader;

    const [titleElement] = parsedBody.splice(resolvedTitleIndex, 1);

    return () => {
      const titleText = getTextFromNode(titleElement);

      return h("div", {}, [
        slots.titleRenderer
          ? h(
              "div",
              slots.titleRenderer({
                title: titleText,
              }),
            )
          : h(TopLevelElement, {
              element: titleElement,
            }),
        parsedBody.map((element) => {
          return h(TopLevelElement, {
            element,
          });
        }),
      ]);
    };
  },
});

function getTextFromNode(node: TreePantheonContent): string | undefined {
  if (typeof node.data === "string" && node.data) {
    return node.data;
  }

  if (node.children) {
    return node.children.map(getTextFromNode).join("\n");
  }

  return undefined;
}

export default Renderer;
