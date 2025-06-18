---
"@pantheon-systems/pcc-react-sdk": minor
---

Updated DOM structure for image elements: The `img` tag is now wrapped within an
additional `span` element. As a result, any CSS targeting
`.pantheon-img-container img` should be updated to reflect the new structure
using the selector `.pantheon-img-container span img`.
