---
"@pantheon-systems/pcc-react-sdk": major
"@pantheon-systems/pcc-vue-sdk": major
---

The `titleRenderer` configuration prop in the SDKs has been updated to return a
rendered node instead of a text string.

This fixes a bug where the title would not be rendered correctly if it contained
extra formatting.

To use the new `titleRenderer` prop, you will need to update your code to expect
a node (React.ReactNode in `react-sdk` and a VNode in `vue-sdk`) instead of a
string. Refer to the starter apps
(https://github.com/pantheon-systems/pantheon-content-cloud-sdk/tree/main/starters)
for examples of how to use the new `titleRenderer` prop.
