import { getLocalConfigDetails } from "./localStorage";

export enum TargetEnvironment {
  production = "production",
  staging = "staging",
  test = "test",
}

type ApiConfig = {
  addOnApiEndpoint: string;
  googleClientId: string;
  googleRedirectUri: string;
  playgroundUrl: string;
};

const apiConfigMap: { [key in TargetEnvironment]: ApiConfig } = {
  [TargetEnvironment.production]: {
    addOnApiEndpoint:
      "https://us-central1-pantheon-content-cloud.cloudfunctions.net/addOnApi",
    googleClientId:
      "432998952749-6eurouamlt7mvacb6u4e913m3kg4774c.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://live-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.staging]: {
    addOnApiEndpoint: "https://addonapi-142470191541.us-central1.run.app",
    googleClientId:
      "142470191541-8o14j77pvagisc66s48kl4ub91f9c7b8.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://multi-staging-collabcms-fe-demo.appa.pantheon.site",
  },
  [TargetEnvironment.test]: {
    addOnApiEndpoint: "https://test-jest.comxyz/addOnApi",
    googleClientId: "test-google-com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
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
    OAUTH_ENDPOINT: `${apiConfig.addOnApiEndpoint}/oauth`,
  };
};
