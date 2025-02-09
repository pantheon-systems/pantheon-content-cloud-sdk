import { markdownToTxt } from "markdown-to-txt";

const headerIdRegex = /\s*\{#h\.[^}]*\}/g;
const markdownHeaderSymbolRegex = /^#+\s*/gm;
const parserConfig = { gfm: true, mangle: false };

export const markdownToText = function (markdown: string) {
  return markdownToTxt(
    markdown.replace(headerIdRegex, ""),
    parserConfig,
  ).replace(markdownHeaderSymbolRegex, "");
};
