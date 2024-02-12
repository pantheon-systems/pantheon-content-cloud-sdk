import { type PantheonClient } from "@pantheon-systems/pcc-sdk-core";

declare global {
  interface Window {
    __PANTHEON_CLIENT?: PantheonClient;
  }
}
