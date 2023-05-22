export interface Article {
  content: string;
  id: string;
  keywords: string[];
  publishedDate: string;
  source: string;
  sourceURL: string;
  title: string;
}

export type ArticleWithoutContent = Omit<Article, 'content'>;
