enum Env {
  production = "production",
  staging = "staging",
  test = "test",
}
type Config = {
  addOnApiEndpoint: string;
  publishEndpoint: string;
  googleClientId: string;
  googleRedirectUri: string;
  playgroundUrl: string;
};
const ENV: Env = (process.env.NODE_ENV as Env) || "production";

const config: { [key in Env]: Config } = {
  [Env.production]: {
    addOnApiEndpoint:
      "https://us-central1-pantheon-content-cloud.cloudfunctions.net/addOnApi",
    publishEndpoint:
      "https://us-central1-pantheon-content-cloud.cloudfunctions.net/publishFile",
    googleClientId:
      "432998952749-6eurouamlt7mvacb6u4e913m3kg4774c.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://live-collabcms-fe-demo.appa.pantheon.site",
  },
  [Env.staging]: {
    addOnApiEndpoint:
      "https://us-central1-pantheon-content-cloud-staging.cloudfunctions.net/addOnApi",
    publishEndpoint:
      "https://us-central1-pantheon-content-cloud-staging.cloudfunctions.net/publishFile",
    googleClientId:
      "142470191541-8o14j77pvagisc66s48kl4ub91f9c7b8.apps.googleusercontent.com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://multi-staging-collabcms-fe-demo.appa.pantheon.site",
  },
  [Env.test]: {
    addOnApiEndpoint: "https://test-jest.comxyz/addOnApi",
    publishEndpoint: "https://test-jest.comxyz/publishFile",
    googleClientId: "test-google-com",
    googleRedirectUri: "http://localhost:3030/oauth-redirect",
    playgroundUrl: "https://test-playground.site",
  },
};

export default config[ENV];
