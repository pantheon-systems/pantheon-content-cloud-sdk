// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterUndefinedProperties(obj: Record<string, any>) {
  const _obj = obj;
  Object.keys(_obj).forEach((key) =>
    _obj[key] === undefined ? delete _obj[key] : {},
  );
  return _obj;
}

export function parameterize(
  obj: { [s: string]: string } | ArrayLike<string>,
  encode = true,
): string {
  const func = encode ? encodeURIComponent : (s: string): string => s;
  return Object.entries<string>(obj)
    .map(([k, v]) => `${func(k)}=${func(v)}`)
    .join("&");
}
