"use client";

import { Article } from "@pantheon-systems/pcc-react-sdk";
import { PageGrid } from "../../components/grid";

interface Props {
  articles: Omit<Article, "content">[];
}

export const Client = ({ articles }: Props) => {
  return <PageGrid data={articles} />;
};
