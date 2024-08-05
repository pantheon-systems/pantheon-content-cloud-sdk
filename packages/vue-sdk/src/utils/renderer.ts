export const getStyleObjectFromString = (str?: string[] | null) => {
  if (!str || str.length < 1) return null;

  const style = {} as Record<string, string>;

  str.forEach((el) => {
    const [property, value] = el.split(":");
    if (!property && !value) return;

    if (property && value) {
      const formattedProperty = formatStringToCamelCase(property.trim());
      style[formattedProperty] = value.trim();
      return;
    }
    switch (property) {
      case "underline":
        style.textDecoration = "underline";
        break;
      case "line-through":
        style.textDecoration = "line-through";
        break;
      case "italic":
        style.fontStyle = "italic";
        break;
      case "bold":
        style.fontWeight = "bold";
        break;
      case "strike-through":
        style.textDecoration = "line-through";
        break;
      case "superscript":
        style.verticalAlign = "super";
        break;
      case "subscript":
        style.verticalAlign = "sub";
        break;
      default:
        break;
    }
  });

  return style;
};

const formatStringToCamelCase = (str?: string) => {
  const splitted = str?.split("-") || [];
  if (splitted.length === 1) return splitted[0];
  return (
    splitted[0] +
    splitted
      .slice(1)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join("")
  );
};

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
