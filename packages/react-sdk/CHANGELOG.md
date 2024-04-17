# @pantheon-systems/pcc-react-sdk

## 3.3.2

### Patch Changes

- @pantheon-systems/pcc-sdk-core@3.3.2

## 3.3.1

### Patch Changes

- 28e312e: New previewbar props added for finer control over where and how it
  renders.
- Updated dependencies [63537f7]
  - @pantheon-systems/pcc-sdk-core@3.3.1

## 3.3.0

### Minor Changes

- 24be191: Add experimental flag "useUnintrusiveTitleRendering" which will use
  the new way of rendering titles, where the document's content will not be
  affected. The old (and still default) way will forcibly move the detected
  title element to the top of the document when rendering.

### Patch Changes

- Updated dependencies
  - @pantheon-systems/pcc-sdk-core@3.3.0

## 3.2.1

### Patch Changes

- 8e880f2: Ability to retrieve gen AI summary results for a search query.
- Updated dependencies [8e880f2]
  - @pantheon-systems/pcc-sdk-core@3.2.1

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

### Patch Changes

- Updated dependencies
  - @pantheon-systems/pcc-sdk-core@3.2.0

## 3.1.2

### Patch Changes

- Updated dependencies
  - @pantheon-systems/pcc-sdk-core@3.1.2

## 3.1.1

### Patch Changes

- @pantheon-systems/pcc-sdk-core@3.1.1

## 3.1.0

### Minor Changes

- 282e854: Support paginated articles

### Patch Changes

- Updated dependencies [282e854]
  - @pantheon-systems/pcc-sdk-core@3.1.0

## 0.1.0

### Minor Changes

- Update React and Vue SDK to depend on core package

  Core package updated to export types and static helpers

  Vue package updated to support subscriptions

### Patch Changes

- Updated dependencies [8461c3d]
- Updated dependencies
  - @pantheon-systems/pcc-sdk-core@1.0.0
