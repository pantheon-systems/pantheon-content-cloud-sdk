---
"@pantheon-systems/pcc-sdk-core": patch
---

- Tries to fetch the site info from pantheon client rather than convenience
  functions in pantheon-api.ts
- If the client is not defined or if pcc grant is used to initialize the client,
  we dont fetch the site.
- If the site is not fetched, the path computed for an article is just
  basepath/slug-or-id
