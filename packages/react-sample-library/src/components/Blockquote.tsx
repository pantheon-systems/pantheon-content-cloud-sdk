import { Blockquote as BaseBlockquote } from "@pantheon-systems/pds-toolkit-react";
import { type SmartComponentMap } from "@pantheon-systems/pcc-sdk-core";

// TODO: Infer the type of the props from the smart component definition
// https://getpantheon.atlassian.net/browse/PCC-827
export const reactComponent = ({
  type,
  quote,
  person,
  source,
  className,
}: BlockquoteProps) => {
  return (
    <BaseBlockquote
      type={type}
      quote={quote}
      person={person}
      source={source}
      className={className}
    />
  );
};

export const smartComponentDefinition = {
  title: "Blockquote",
  iconUrl: null,
  fields: {
    type: {
      displayName: "Type",
      type: "enum",
      required: true,
      options: [
        {
          label: "Full width",
          value: "full-width",
        },
        {
          label: "Inline",
          value: "inline",
        },
      ],
    },
    quote: {
      displayName: "Quote",
      type: "string",
      required: true,
    },
    person: {
      displayName: "Person",
      type: "string",
      required: false,
    },
    source: {
      displayName: "Source",
      type: "string",
      required: false,
    },
    className: {
      displayName: "Classname",
      type: "string",
      required: false,
    },
  },
} satisfies SmartComponentMap[string];
