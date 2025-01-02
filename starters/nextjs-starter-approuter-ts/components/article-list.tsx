"use client";

import {
  ArticleWithoutContent,
  PaginatedArticle,
} from "@pantheon-systems/pcc-react-sdk";
import React from "react";
import { PAGE_SIZE } from "../constants";
import { usePagination } from "../hooks/usePagination";
import { ArticleGrid } from "./grid";
import PageHeader from "./page-header";
import Pagination from "./pagination";

interface Props {
  headerText: string;
  articles: PaginatedArticle[] | ArticleWithoutContent[];
  totalCount: number;
  cursor: string;
  fetcher: (cursor?: string | null | undefined) => Promise<{
    data: PaginatedArticle[] | ArticleWithoutContent[];
    newCursor: string;
  }>;
  additionalHeader?: React.ReactNode;
}

export default function ArticleList({
  headerText,
  articles,
  totalCount,
  cursor,
  fetcher,
  additionalHeader = null,
}: Props) {
  const {
    data: currentArticles,
    onPageChange,
    fetching,
    currentPage,
  } = usePagination({
    cursor,
    initialArticles: articles,
    fetcher,
  });

  return (
    <section className="max-w-screen-3xl mx-auto px-4 pt-16 sm:w-4/5 md:w-3/4 lg:w-4/5 2xl:w-3/4">
      <PageHeader title={headerText} />
      {additionalHeader}
      <ArticleGrid articles={currentArticles as ArticleWithoutContent[]} />
      <div className="mt-4 flex flex-row items-center justify-center">
        <Pagination
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          currentPage={currentPage}
          onChange={onPageChange}
          disabled={fetching}
        />
      </div>
    </section>
  );
}
