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
    addOnApiEndpoint:
      "https://us-central1-pantheon-content-cloud.cloudfunctions.net/addOnApi",
    // TODO: Update with the Auth0 prod tenant
    auth0ClientId:
      "432998952749-6eurouamlt7mvacb6u4e913m3kg4774c.apps.googleusercontent.com",
    auth0RedirectUri: "http://localhost:3030/oauth-redirect",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://dev-m4eh6wq011fxmahi.us.auth0.com",
    googleClientId:
      "432998952749-6eurouamlt7mvacb6u4e913m3kg4774c.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://live-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.staging]: {
    // TODO: Uncomment the correct one
    // addOnApiEndpoint:
    //   "https://us-central1-pantheon-content-cloud-staging.cloudfunctions.net/addOnApi",
    addOnApiEndpoint: "http://localhost:8080",
    // TODO: Update with the Auth0 staging tenant
    auth0ClientId: "RAHxEbc251zD529hByapcv6Dcp3pmv4P",
    auth0RedirectUri: "http://localhost:3030/oauth-redirect",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://dev-m4eh6wq011fxmahi.us.auth0.com",
    googleClientId:
      "142470191541-bmomms4luuhoc68g903rscgr9qa3150b.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://multi-staging-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.test]: {
    addOnApiEndpoint: "https://test-jest.comxyz/addOnApi",
    auth0ClientId: "test-google-com",
    auth0RedirectUri: "http://localhost:3030/oauth-redirect",
    auth0Audience: "https://addonapi-cxog5ytt4a-uc.a.run.app",
    auth0Issuer: "https://dev-m4eh6wq011fxmahi.us.auth0.com",
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

    API_KEY_ENDPOINT: `${apiConfig.addOnApiEndpoint}/api-key`,
    SITE_ENDPOINT: `${apiConfig.addOnApiEndpoint}/sites`,
    DOCUMENT_ENDPOINT: `${apiConfig.addOnApiEndpoint}/articles`,
    AUTH0_ENDPOINT: `${apiConfig.addOnApiEndpoint}/auth0/`,
    OAUTH_ENDPOINT: `${apiConfig.addOnApiEndpoint}/oauth/`,
  };
};
