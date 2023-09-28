// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterUndefinedProperties(obj: Record<string, any>) {
  const _obj = obj;
  Object.keys(_obj).forEach((key) =>
    _obj[key] === undefined ? delete _obj[key] : {},
  );
  return _obj;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parameterize(obj: any, encode = true): string {
  const func = encode ? encodeURIComponent : (s: string): string => s;
  return Object.entries<string>(obj)
    .map(([k, v]) => `${func(k)}=${func(v)}`)
    .join("&");
}

export function replaceEnvVariable(
  envFile: string,
  key: string,
  value: string,
) {
  const envFileLines = envFile.split("\n");
  const index = envFileLines.findIndex((x) => x.indexOf(key) === 0);
  const parts = envFileLines[index].split("=");
  parts[1] = value;
  envFileLines[index] = parts.join("=");
  return envFileLines.join("\n");
}
