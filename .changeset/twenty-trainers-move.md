---
"@pantheon-systems/pcc-react-sdk": minor
"@pantheon-systems/pcc-vue-sdk": minor
---

Add experimental flag "useUnintrusiveTitleRendering" which will use the new way
of rendering titles, where the document's content will not be affected. The old
(and still default) way will forcibly move the detected title element to the top
of the document when rendering.
