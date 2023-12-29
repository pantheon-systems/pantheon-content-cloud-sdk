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
}

export enum ContentType {
  TEXT_MARKDOWN = "TEXT_MARKDOWN",
  TREE_PANTHEON = "TREE_PANTHEON",
  TREE_PANTHEON_V2 = "TREE_PANTHEON_V2",
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

type Attrs = Record<string, string> & {
  colspan?: string;
  rowspan?: string;
  width?: string;
  height?: string;
  href?: string;
  src?: string;
  alt?: string;
  title?: string;
};

export interface PantheonTreeNode<T extends "component" | string = string> {
  tag: T;
  parentNode: PantheonTreeNode | null;
  prevNode: PantheonTreeNode | null;
  nextNode: PantheonTreeNode | null;
  children: PantheonTreeNode[];
  data: string | null;
  style: string[] | null;
  attrs: Attrs;
  id?: string;
  type?: string;
}
export interface PantheonTree {
  version: string;
  children: PantheonTreeNode[];
}

const fieldTypes = z.enum(["string", "number", "boolean", "date", "file"]);

const baseFieldSchema = z.object({
  type: fieldTypes,
  displayName: z.string(),
  required: z.boolean(),
});

const optionsSchema = z.array(
  z.union([
    z.string(),
    z.object({
      label: z.string(),
      value: z.string(),
    }),
  ]),
);

const enumFieldSchema = baseFieldSchema.merge(
  z.object({
    type: z.literal("enum"),
    options: z.union([optionsSchema, optionsSchema.readonly()]),
  }),
);

const objectFieldSchema = baseFieldSchema.merge(
  z.object({
    type: z.literal("object"),
    multiple: z.boolean().optional(),
    fields: z.union([
      z.record(z.string(), baseFieldSchema),
      z.record(z.string(), baseFieldSchema).readonly(),
    ]),
  }),
);

const fieldSchema = z.discriminatedUnion("type", [
  baseFieldSchema,
  enumFieldSchema,
  objectFieldSchema,
]);

export const SmartComponentMapZod = z.record(
  z.string(),
  z.object({
    title: z.string(),
    iconUrl: z.string().nullable().optional(),
    exampleImageUrl: z.string().nullable().optional(),
    fields: z.record(z.string(), fieldSchema),
  }),
);

export type SmartComponentMap = z.infer<typeof SmartComponentMapZod>;

/**
 * Infers properties for a smart component based on field definitions.
 */
export type InferSmartComponentProps<
  T extends SmartComponentMap[keyof SmartComponentMap],
> = Optional<
  {
    [K in keyof T["fields"]]: InferFieldProps<T["fields"][K]>;
  },
  OptionalFields<T["fields"]>
>;

// Utility type to make certain keys of a type optional.
type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// Extracts keys that represent optional fields in a record.
type OptionalFields<T> = {
  [K in keyof T]: T[K] extends { required: false } ? K : never;
}[keyof T];

// Generic type for a field in a smart component.
type SmartComponentMapField =
  SmartComponentMap[keyof SmartComponentMap]["fields"][keyof SmartComponentMap[keyof SmartComponentMap]["fields"]];

// Infers TypeScript type for a field based on its type definition.
type InferFieldProps<T extends SmartComponentMapField> = T extends {
  type: "enum";
  options: readonly { value: infer V }[];
}
  ? V
  : T extends { type: "number" }
  ? number
  : T extends { type: "boolean" }
  ? boolean
  : T extends { type: "string" | "file" | "date" }
  ? string
  : T extends {
      type: "object";
      multiple: boolean;
      fields: Record<string, unknown>;
    }
  ? T["multiple"] extends true
    ? Optional<
        { [K in keyof T["fields"]]: InferFieldProps<T["fields"][K]> },
        OptionalFields<T["fields"]>
      >[]
    : Optional<
        { [K in keyof T["fields"]]: InferFieldProps<T["fields"][K]> },
        OptionalFields<T["fields"]>
      >
  : unknown;
