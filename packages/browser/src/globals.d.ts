import { PantheonClient } from "./lib/pantheon";

declare global {
  interface Window {
    __PANTHEON_CLIENT?: PantheonClient;
  }
}
