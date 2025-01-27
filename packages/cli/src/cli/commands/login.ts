import nunjucks from "nunjucks";
import { getAuthProvider } from "../../lib/auth";
import { errorHandler } from "../exceptions";

nunjucks.configure({ autoescape: true });

async function login({
  authType,
  scopes,
}: {
  authType: "auth0" | "google";
  scopes?: string[];
}): Promise<void> {
  const provider = getAuthProvider(authType, scopes);
  await provider.login();
}
export default errorHandler<{
  authType: "auth0" | "google";
  scopes?: string[];
}>(login);
export const LOGIN_EXAMPLES = [
  { description: "Login the user", command: "$0 login" },
];
