import { PantheonAPI } from "@pantheon-systems/pcc-sdk-core";
import { pantheonAPIOptions } from "./api-options";

const handler = PantheonAPI(pantheonAPIOptions);
export { handler as GET, handler as POST };
