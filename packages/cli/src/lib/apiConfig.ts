import { getConfigDetails } from "./localStorage";

export enum TargetEnvironment {
  production = "production",
  staging = "staging",
  test = "test",
}

type ApiConfig = {
  addOnApiEndpoint: string;
  auth0ClientId: string;
  auth0RedirectUri: string;
  auth0Audience: string;
  auth0Issuer: string;
  googleClientId: string;
  googleRedirectUri: string;
  playgroundUrl: string;
};

const apiConfigMap: { [key in TargetEnvironment]: ApiConfig } = {
  [TargetEnvironment.production]: {
    addOnApiEndpoint: "https://addonapi-gfttxsojwq-uc.a.run.app",
    auth0ClientId: "rRRQ1hldtsVmjiVSKxLfTodZ1hx9y99o",
    auth0RedirectUri: "http://localhost:3030/auth/callback",
    auth0Audience: "https://addonapi-gfttxsojwq-uc.a.run.app",
    auth0Issuer: "https://pantheon.auth0.com",
    googleClientId:
      "432998952749-6eurouamlt7mvacb6u4e913m3kg4774c.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://live-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.staging]: {
    addOnApiEndpoint: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0ClientId: "fTmdrlsHK0HJ75WMSqWTLrUgDiBR5VG4",
    auth0RedirectUri: "http://localhost:3030/auth/callback",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://pantheon-staging.us.auth0.com",
    googleClientId:
      "142470191541-bmomms4luuhoc68g903rscgr9qa3150b.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://multi-staging-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.test]: {
    addOnApiEndpoint: "https://test-jest.comxyz/addOnApi",
    auth0ClientId: "test-google-com",
    auth0RedirectUri: "http://localhost:3030/auth/callback",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://pantheon-staging.us.auth0.com",
    googleClientId: "test-google-com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://test-playground.site",
  },
};

export const getApiConfig = async () => {
  const config = await getConfigDetails();
  const apiConfig =
    apiConfigMap[
      config?.targetEnvironment ||
        (process.env.NODE_ENV as TargetEnvironment) ||
        "production"
    ];

  return {
    ...apiConfig,

    ACCOUNT_ENDPOINT: `${apiConfig.addOnApiEndpoint}/accounts`,
    API_KEY_ENDPOINT: `${apiConfig.addOnApiEndpoint}/api-key`,
    SITE_ENDPOINT: `${apiConfig.addOnApiEndpoint}/sites`,
    DOCUMENT_ENDPOINT: `${apiConfig.addOnApiEndpoint}/articles`,
    AUTH0_ENDPOINT: `${apiConfig.addOnApiEndpoint}/auth0/`,
    OAUTH_ENDPOINT: `${apiConfig.addOnApiEndpoint}/oauth/`,
  };
};
