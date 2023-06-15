import { PantheonClient } from "@pcc/react";
import { PCC_HOST } from "./constants";

export const pantheonClient = new PantheonClient({
  pccHost: PCC_HOST,
});
