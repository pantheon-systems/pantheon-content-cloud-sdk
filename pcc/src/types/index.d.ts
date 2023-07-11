declare enum CliTemplateOptions {
  'nextjs' = 'nextjs',
  'gatsby' = 'gatsby',
}

declare type ApiKey = {
  id: string;
  keyMasked: string;
  created: string;
};

declare type AuthDetails = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
};
