import {
  PantheonAPI,
  PantheonAPIOptions,
} from "@pantheon-systems/pcc-sdk-core";
import {
  defineEventHandler,
  parseCookies,
  getQuery,
  getRouterParams,
  sendRedirect,
  setResponseHeader,
  getResponseHeader,
} from "h3";

export function NuxtPantheonAPI(options?: PantheonAPIOptions) {
  return defineEventHandler((event) => {
    return PantheonAPI(options)(
      {
        query: { ...getQuery(event), command: getRouterParams(event).command },
        cookies: parseCookies(event),
        url: event.path,
      },
      {
        setHeader: (key: string, value: string) => {
          setResponseHeader(event, key, value);
        },
        redirect: async (code: number, url: string) => {
          await sendRedirect(event, url, code);
        },
        json: (data: unknown) => {
          return data;
        },
        getHeader: (key: string) => {
          return getResponseHeader(event, key);
        },
      },
    );
  });
}
