export function filterUndefinedProperties(obj: Record<string, any>) {
  const _obj = obj;
  Object.keys(_obj).forEach((key) =>
    _obj[key] === undefined ? delete _obj[key] : {},
  );
  return _obj;
}
export function parameterize(obj: any, encode = true): string {
  const func = encode ? encodeURIComponent : (s: string): string => s;
  return Object.entries<string>(obj)
    .map(([k, v]) => `${func(k)}=${func(v)}`)
    .join("&");
}
