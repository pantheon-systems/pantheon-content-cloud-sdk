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
  articles: PaginatedArticle[] | ArticleWithoutContent[];
  totalCount: number;
  cursor: string;
}

export default function ArticleList({ articles, totalCount, cursor }: Props) {
  const {
    data: currentArticles,
    onPageChange,
    fetching,
    currentPage,
  } = usePagination({
    cursor,
    initialArticles: articles,
    pageSize: PAGE_SIZE,
  });

  return (
    <section className="max-w-screen-3xl mx-auto px-4 pt-16 sm:w-4/5 md:w-3/4 lg:w-4/5 2xl:w-3/4">
      <PageHeader title="Articles" />
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
