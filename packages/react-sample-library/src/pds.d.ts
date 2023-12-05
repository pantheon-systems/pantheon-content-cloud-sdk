declare module "*.css";

declare module "@pantheon-systems/pds-toolkit-react" {
  declare interface Blockquote {
    type: "full-width" | "inline";
    quote: string;
    person: string;
    source: string;

    // We should set this in order to override?
    // className: string;
  }
}
