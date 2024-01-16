// Sourced from https://github.com/hatashiro/react-attr-converter/blob/master/index.js
const htmlAttributeToReactProp: Record<string, string> = {
  // Specials
  for: "htmlFor",
  class: "className",

  // HTML attributes
  cellpadding: "cellPadding",
  cellspacing: "cellSpacing",
  classname: "className",
  colspan: "colSpan",
  crossorigin: "crossOrigin",
  htmlfor: "htmlFor",
  marginheight: "marginHeight",
  marginwidth: "marginWidth",
  maxlength: "maxLength",
  minlength: "minLength",
  readonly: "readOnly",
  referrerpolicy: "referrerPolicy",
  rowspan: "rowSpan",
  srcdoc: "srcDoc",
  srclang: "srcLang",
  srcset: "srcSet",
};

export const convertAttributes = function (attrs: Record<string, unknown>) {
  return Object.keys(attrs).reduce(
    (acc, attr) => {
      const key = attr.toLowerCase();
      const value = attrs[attr];

      return {
        ...acc,
        [htmlAttributeToReactProp[key] || key]: value,
      };
    },
    {} as Record<string, unknown>,
  );
};
