const reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g;
const reHasEscapedHtml = RegExp(reEscapedHtml.source);

const htmlUnescapes = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

const basePropertyOf = (object: Record<string, string>) => (key: string) =>
  object[key];

const unescapeHtmlChar = basePropertyOf(htmlUnescapes);

export const unescapeHTMLEntities = (str: string) =>
  str && reHasEscapedHtml.test(str)
    ? str.replace(reEscapedHtml, unescapeHtmlChar)
    : str;
