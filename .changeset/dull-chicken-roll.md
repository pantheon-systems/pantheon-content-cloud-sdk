---
"@pantheon-systems/next-approuter-pcc-starter-ts": minor
"@pantheon-systems/pcc-react-sdk": minor
"@pantheon-systems/pcc-sdk-core": minor
---

- Added functionality in the pcc-sdk-core to compute the path of an article from
the site's content structure. This will be the path at which the article will be
visible.
- If someone tries to access the article without the full path, it will be
redirected to the full path.
- Developers can use the default functionality as is and also customise the path
generation to only include the id or slug and a configurable number of parents.
