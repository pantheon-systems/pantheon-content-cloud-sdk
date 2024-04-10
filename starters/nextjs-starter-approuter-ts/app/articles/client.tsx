"use client";

import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { PageGrid } from "../../components/grid";

interface Props {
  articles: Omit<Article, "content">[];
}

export const Client = ({ articles }: Props) => {
  return <PageGrid data={articles} />;
};
