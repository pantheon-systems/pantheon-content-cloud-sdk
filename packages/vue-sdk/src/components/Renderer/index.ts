import {
  Article,
  PantheonTree,
  PantheonTreeNode,
  TreePantheonContent,
} from "@pantheon-systems/pcc-sdk-core/types";
import {
  DefineComponent,
  defineComponent,
  h,
  PropType,
  SlotsType,
  Teleport,
} from "vue-demi";
import PreviewBar from "../Preview/index.vue";
import MarkdownRenderer from "./MarkdownRenderer";
import PantheonTreeRenderer from "./PantheonTreeRenderer";
import PantheonTreeV2Renderer from "./PantheonTreeV2Renderer";

export type SmartComponentMap = {
  // Can't know prop types of component, so we use any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: InstanceType<DefineComponent<any, any, any>>;
};

export type PreviewBarProps = {
  previewBarOverride?: InstanceType<DefineComponent<any, any, any>>;
  collapsedPreviewBarProps?: Record<string, unknown>;
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
    bodyClass: {
      type: String,
      required: false,
    },
    headerClass: {
      type: String,
      required: false,
    },
    previewBarProps: {
      type: Object as PropType<PreviewBarProps>,
      required: false,
    },
  },
  slots: Object as SlotsType<{
    titleRenderer: {
      title: string | undefined;
    };
  }>,
  render() {
    const props = this.$props;
    const slots = this.$slots;

    if (!props.article.content) return null;

    if (props.article.contentType === "TEXT_MARKDOWN") {
      return h("div", {}, [
        props.article.publishingLevel === "REALTIME"
          ? h(Teleport, { to: "body" }, [
              h(PreviewBar, { article: props.article }),
            ])
          : null,
        h(MarkdownRenderer, {
          source: props.article.content || "",
          smartComponentMap: props.smartComponentMap,
          options: {
            html: true,
          },
        }),
      ]);
    }

    const content = JSON.parse(props.article.content) as
      | PantheonTree
      | TreePantheonContent[];

    const renderer =
      // V1 content is array of TreePantheonContent
      Array.isArray(content) ? PantheonTreeRenderer : PantheonTreeV2Renderer;

    const parsedContent = Array.isArray(content)
      ? content
      : content.children || [];

    const indexOfFirstHeader = parsedContent.findIndex((x) =>
      ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "title"].includes(x.tag),
    );

    const indexOfFirstParagraph = parsedContent.findIndex((x) => x.tag === "p");
    const resolvedTitleIndex =
      indexOfFirstHeader === -1 ? indexOfFirstParagraph : indexOfFirstHeader;

    const [titleElement] = parsedContent.splice(resolvedTitleIndex, 1);
    const titleText = getTextFromNode(titleElement);

    return h("div", {}, [
      props.article.publishingLevel === "REALTIME"
        ? h(Teleport, { to: "body" }, [
            h(PreviewBar, { ...this.previewBarProps, article: props.article }),
          ])
        : null,
      slots.titleRenderer
        ? h(
            "div",
            slots.titleRenderer({
              title: titleText,
            }),
          )
        : h("div", { class: props.headerClass }, [
            // @ts-expect-error Dynamic component props
            h(renderer, {
              element: titleElement,
            }),
          ]),
      h("div", { class: props.bodyClass }, [
        parsedContent.map((element) => {
          // @ts-expect-error Dynamic component props
          return h(renderer, {
            element,
            smartComponentMap: props.smartComponentMap,
          });
        }),
      ]),
    ]);
  },
});

function getTextFromNode(
  node: PantheonTreeNode | TreePantheonContent | undefined,
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
