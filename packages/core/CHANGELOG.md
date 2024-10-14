# @pantheon-systems/pcc-sdk-core

## 3.10.0-beta.0

### Minor Changes

- 572fb97: Add support for metadata groups (like authors).

## 3.9.0

### Minor Changes

- 9adfb1a: Component schema supports special 'variant' attribute.

## 3.9.0-beta.0

### Minor Changes

- 4267508: Component schema supports special 'variant' attribute.

## 3.8.1

### Patch Changes

- 61c7d15: Add 'preamble' property for searches with summary.
- Fixed issue where sometimes the question input appeared to hang.

## 3.8.0

## 3.7.0

### Patch Changes

- 11e0509: Fixed issue where some GQL parameters would not be passed to the API
  in `getAllArticles`
- 87fdf27: PCC-GRANT (preview token) cookie now set with most relaxed security
  so that preview-pages can be shown in iframes.

## 3.6.1

### Patch Changes

- 183ad17: Added queries and helper methods for fetching site information

## 3.6.0

### Patch Changes

- 61363af: Fixes issue where redirects to local preview/publish targets would be
  redirected to https://localhost
- 3651708: Fix how protocols are being forwarded by API handler.
- 61363af: Removes inline sourcemaps. Sourcemaps are still provided, just linked
  in separate files instead.

## 3.6.0-beta.3

## 3.6.0-beta.2

## 3.6.0-beta.1

### Patch Changes

- Fix how protocols are being forwarded by API handler.

## 3.6.0-beta.0

## 3.5.3

### Patch Changes

- Fix type export for Article

## 3.5.3-beta.0

### Patch Changes

- Fix type export for Article

## 3.5.2

### Patch Changes

- fcfa574: Fix graphql error handling issue which caused sites to show error
  pages instead of 404.
- 289e05c: Add updateConfig function which will override the default PCC
  connection settings that PCCConvenienceFunctions will use.

## 3.5.2-beta.1

### Patch Changes

- Add updateConfig function which will override the default PCC connection
  settings that PCCConvenienceFunctions will use.

## 3.5.2-beta.0

### Patch Changes

- Fix graphql error handling issue which caused sites to show error pages
  instead of 404.

## 3.5.1

## 3.5.0

### Patch Changes

- 0e74720: Add textarea to supported smartcomponent metadata fields
- 4cab3e2: Fix how JSON was returned, headers were set, and redirect codes were
  checked for PantheonAPI affecting Nextjs page router implementations.

## 3.4.1

### Patch Changes

- 19f9ac8: Fix how preview JWT token is set from PantheonAPI

## 3.4.0

### Minor Changes

- 37e1c39: PantheonAPI now supports app router.
- 5124a8b: Added support for `metadataFilters` parameter sent to GraphQL API.

## 3.3.3

## 3.3.2

## 3.3.1

### Patch Changes

- 63537f7: Consume article search results snippets from the backend (GQL).

## 3.3.0

### Patch Changes

- Fixed implementation of PCCConvenienceFunctions.getArticleBySlugOrId

## 3.2.1

### Patch Changes

- 8e880f2: Ability to retrieve gen AI summary results for a search query.

## 3.2.0

### Minor Changes

- - More detailed Apollo errors will be surfaced from the SDK.
  - Bump minimum React version to 18.
  - Gracefully handle rendering errors that occur inside smart components.
  - Added disableAllStyles to the Vue SDK (React SDK already had this).
  - Simplified SDK integration. Less boilerplate needed to turn on by using
    commonsense defaults under the hood. New PCCConvenienceFunctions utilities
    object which provides what used to be in the boilerplate (such as
    getAllArticles, getArticleBySlugOrId, getRecommendedArticles, and getTags).

## 3.1.2

### Patch Changes

- Pagination query is no longer the default.

## 3.1.1

## 3.1.0

### Minor Changes

- 282e854: Support paginated articles

## 0.1.0

### Minor Changes

- Update React and Vue SDK to depend on core package

  Core package updated to export types and static helpers

  Vue package updated to support subscriptions
