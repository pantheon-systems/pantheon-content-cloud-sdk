import { getLocalConfigDetails } from "./localStorage";

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
  playgroundUrl: string;
};

const apiConfigMap: { [key in TargetEnvironment]: ApiConfig } = {
  [TargetEnvironment.production]: {
    addOnApiEndpoint:
      "https://us-central1-pantheon-content-cloud.cloudfunctions.net/addOnApi",
    auth0ClientId:
      "432998952749-6eurouamlt7mvacb6u4e913m3kg4774c.apps.googleusercontent.com",
    auth0RedirectUri: "http://localhost:3030/oauth-redirect",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://dev-m4eh6wq011fxmahi.us.auth0.com",
    playgroundUrl: "https://live-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.staging]: {
    addOnApiEndpoint: "http://localhost:8080",
    auth0ClientId: "RAHxEbc251zD529hByapcv6Dcp3pmv4P",
    auth0RedirectUri: "http://localhost:3030/oauth-redirect",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://dev-m4eh6wq011fxmahi.us.auth0.com",
    playgroundUrl: "https://multi-staging-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.test]: {
    addOnApiEndpoint: "https://test-jest.comxyz/addOnApi",
    auth0ClientId: "test-google-com",
    auth0RedirectUri: "http://localhost:3030/oauth-redirect",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://dev-m4eh6wq011fxmahi.us.auth0.com",
    playgroundUrl: "https://test-playground.site",
  },
};

export const getApiConfig = async () => {
  const config = await getLocalConfigDetails();
  const apiConfig =
    apiConfigMap[
      config?.targetEnvironment ||
        (process.env.NODE_ENV as TargetEnvironment) ||
        "production"
    ];

  return {
    ...apiConfig,

    API_KEY_ENDPOINT: `${apiConfig.addOnApiEndpoint}/api-key`,
    SITE_ENDPOINT: `${apiConfig.addOnApiEndpoint}/sites`,
    DOCUMENT_ENDPOINT: `${apiConfig.addOnApiEndpoint}/articles`,
    AUTH0_ENDPOINT: `${apiConfig.addOnApiEndpoint}/auth0/`,
  };
};
