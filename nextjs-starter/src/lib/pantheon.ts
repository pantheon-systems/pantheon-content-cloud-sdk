import { PantheonClient } from "@pcc/react";

if (!process.env.NEXT_PUBLIC_GQL_ENDPOINT) {
  throw new Error("NEXT_PUBLIC_GQL_ENDPOINT is not set");
}

export const pantheonClient = new PantheonClient({
  pccHost: process.env.NEXT_PUBLIC_GQL_ENDPOINT,
});
