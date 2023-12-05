import crypto from "crypto";
import _ from "lodash";

export const generateUniqueHeaderIds = () => {
  const ids = new Set();
  return (value: string) => {
    let result = _.kebabCase(value);
    if (ids.has(result)) {
      result = `${result}-${crypto.randomBytes(3).toString("hex")}`;
      ids.add(result);
    } else {
      ids.add(result);
    }
    return result;
  };
};
