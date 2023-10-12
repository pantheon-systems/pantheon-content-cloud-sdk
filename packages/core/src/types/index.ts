import { z } from "zod";

export interface Article {
  content: string | null;
  contentType: keyof typeof ContentType;
  id: string;
  slug?: string | null;
  tags: string[] | null;
  publishedDate: number | null;
  publishingLevel: keyof typeof PublishingLevel;
  title: string | null;
  updatedAt: number | null;
  metadata: unknown | null;
  previewActiveUntil: number | null;
}

export type ArticleWithoutContent = Omit<Article, "content">;

export enum PublishingLevel {
  PRODUCTION = "PRODUCTION",
  REALTIME = "REALTIME",
  STAGING = "STAGING",
}

export enum ContentType {
  TEXT_MARKDOWN = "TEXT_MARKDOWN",
  TREE_PANTHEON = "TREE_PANTHEON",
}

export interface TreePantheonContent {
  tag: string;
  attrs: {
    [key: string | "rowspan" | "colspan"]:
      | unknown
      | unknown[]
      | null
      | undefined;
  };
  children: TreePantheonContent[] | null | undefined;
  data?: string | null | undefined;
  style?: string[] | null | undefined;
  href?: string | null | undefined;
  alt?: string | null | undefined;
  title?: string | null | undefined;
  src?: string | null | undefined;
  type: string;
}

export interface TreePantheonContentSmartComponent extends TreePantheonContent {
  attributes: { [key: string]: string | null | boolean | number | unknown };
}

export const SmartComponentMapZod = z.record(
  z.string(),
  z.object({
    title: z.string(),
    iconUrl: z.string().nullable().optional(),
    fields: z.record(
      z.string(),
      z.object({
        displayName: z.string().nullable().optional(),
        required: z.boolean().nullable().optional(),
        type: z.string().nullable(),
      }),
    ),
  }),
);

export type SmartComponentMap = z.infer<typeof SmartComponentMapZod>;
