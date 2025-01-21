import { PantheonAPI } from "@pantheon-systems/pcc-react-sdk/server";
import { pantheonAPIOptions } from "./api-options";

const handler = PantheonAPI(pantheonAPIOptions);
export { handler as GET, handler as POST };