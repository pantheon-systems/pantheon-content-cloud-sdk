import {
  Article,
  PantheonTree,
  PantheonTreeNode,
  TreePantheonContent,
} from "@pantheon-systems/pcc-sdk-core/types";
import _ from "lodash";
import { useMemo } from "react";

export function getArticleTitle(article: Article | undefined): string | null {
  if (!article?.content) {
    return null;
  }

  const contentType = article?.contentType;

  if (contentType === "TEXT_MARKDOWN") {
    return null;
  }

  const jsonContent = JSON.parse(article.content) as
    | PantheonTree
    | TreePantheonContent[];

  const content: Array<PantheonTreeNode | TreePantheonContent> = Array.isArray(
    jsonContent,
  )
    ? jsonContent
    : jsonContent.children;

  const titleContent = content.find((x) => x.tag === "title");

  if (titleContent != null) {
    const flatMap = titleContent.children
      ? _.flatMapDeep(
          titleContent.children,
          (x: PantheonTreeNode | TreePantheonContent) => x.data,
        )
      : [];

    return titleContent.data + flatMap.join("");
  } else if (
    article?.metadata?.title != null &&
    typeof article?.metadata?.title === "string"
  ) {
    return article.metadata.title;
  } else {
    return article.title || "";
  }
}

export function useArticleTitle(article: Article | undefined): string | null {
  return useMemo(() => getArticleTitle(article) || "", [article]);
}
