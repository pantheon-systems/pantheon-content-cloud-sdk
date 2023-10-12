import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
import {
  defineEventHandler,
  getQuery,
  getRouterParams,
  sendRedirect,
  setResponseHeader,
} from "h3";

export function NuxtPantheonAPI(options?: PantheonAPIOptions) {
  return defineEventHandler((event) => {
    return PantheonAPI(options)(
      {
        query: { ...getQuery(event), command: getRouterParams(event).command },
      },
      {
        setHeader: (key, value) => {
          setResponseHeader(event, key, value);
        },
        redirect: async (code, url) => {
          await sendRedirect(event, url, code);
        },
        json: (data) => {
          return data;
        },
      },
    );
  });
}
