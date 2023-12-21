import type { Preview } from "@storybook/react";

import "@pantheon-systems/pds-toolkit-react/_dist/css/pds-core.css";
import "@pantheon-systems/pds-toolkit-react/_dist/css/pds-layouts.css";
import "@pantheon-systems/pds-toolkit-react/_dist/css/pds-components.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
  },
};

export default preview;
