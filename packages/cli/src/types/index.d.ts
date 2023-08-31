declare type CliTemplateOptions = "nextjs" | "gatsby";

declare type ApiKey = {
  id: string;
  keyMasked: string;
  created: string;
};

declare type Site = {
  id: string;
  url: string;
  created?: number;
};

declare type AuthDetails = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
};

declare type PackageManager = "npm" | "pnpm" | "yarn";
