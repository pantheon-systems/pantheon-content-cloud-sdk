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
  setResponseStatus,
} from "h3";

export function NuxtPantheonAPI(options?: PantheonAPIOptions) {
  return defineEventHandler((event) => {
    return PantheonAPI(options)(
      {
        query: { ...getQuery(event), command: getRouterParams(event).command },
        cookies: parseCookies(event),
        // url: event.path,
      },
      {
        headers: {},
        setHeader: (key: string, value: string | string[]) => {
          setResponseHeader(event, key, value);
        },
        redirect: async (
          url: string,
          options: {
            status?: number;
            headers?: Headers;
          },
        ) => {
          if (options.headers) {
            options.headers.forEach((v, k) => setResponseHeader(event, k, v));
          }

          if (options.status) {
            setResponseStatus(event, options.status);
          }

          await sendRedirect(event, url, options.status);
        },
        json: (
          data: unknown,
          options: {
            status?: number;
            headers?: Headers;
          },
        ) => {
          if (options.headers) {
            options.headers.forEach((k, v) => setResponseHeader(event, k, v));
          }

          if (options.status) {
            setResponseStatus(event, options.status);
          }

          return data;
        },
        getHeader: (key: string) => {
          return getResponseHeader(event, key);
        },
      },
    );
  });
}
