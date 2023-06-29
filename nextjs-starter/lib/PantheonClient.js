import { PantheonClient } from "@pantheon-systems/pcc-react-sdk";
import { PCC_HOST } from "./constants";

export const pantheonClient = new PantheonClient({
  pccHost: PCC_HOST,
});
