# @pantheon-systems/pcc-vue-sdk

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
