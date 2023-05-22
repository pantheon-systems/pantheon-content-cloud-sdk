export interface Article {
  content: string | null;
  id: string;
  keywords: string[] | null;
  publishedDate: string | null;
  source: string | null;
  sourceURL: string | null;
  title: string | null;
}

export type ArticleWithoutContent = Omit<Article, 'content'>;
