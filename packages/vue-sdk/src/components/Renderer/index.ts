import {
  Article,
  PantheonTree,
  PantheonTreeNode,
} from "@pantheon-systems/pcc-sdk-core/types";
import {
  DefineComponent,
  defineComponent,
  h,
  PropType,
  SlotsType,
} from "vue-demi";
import MarkdownRenderer from "./MarkdownRenderer";
import PantheonTreeRenderer from "./PantheonTreeRenderer";

export type SmartComponentMap = {
  // Can't know prop types of component, so we use any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: InstanceType<DefineComponent<any, any, any>>;
};

const ArticleRenderer = defineComponent({
  name: "ArticleRenderer",
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true,
    },
    smartComponentMap: {
      type: Object as PropType<SmartComponentMap>,
      required: false,
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

    const rawContent = article?.content ? JSON.parse(article.content) : [];
    const parsedBody = Array.isArray(rawContent)
      ? (rawContent as PantheonTreeNode[])
      : (rawContent as PantheonTree).children;

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
          : h(PantheonTreeRenderer, {
              element: titleElement,
            }),
        parsedBody.map((element) => {
          return h(PantheonTreeRenderer, {
            element,
            smartComponentMap: props.smartComponentMap,
          });
        }),
      ]);
    };
  },
});

function getTextFromNode(
  node: PantheonTreeNode | undefined,
): string | undefined {
  if (!node) {
    return undefined;
  }

  if (typeof node.data === "string" && node.data) {
    return node.data;
  }

  if (node.children) {
    return node.children.map(getTextFromNode).join("\n");
  }

  return undefined;
}

export default ArticleRenderer;
