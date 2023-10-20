# Pantheon Content Cloud SDKs

## Overview

This repository houses the Pantheon Content Cloud SDKs and starters.

These SDKs are used to interact with the Pantheon Content Cloud APIs. Starters
allow you to quickly get up and running with Pantheon Content Cloud.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) Version 18 LTS
- [PNPM](https://pnpm.io/) Version 8.6.11

### Setup the monorepo

1. Install dependencies in all packages

   ```sh
   pnpm install
   ```

2. Build all packages

   ```sh
    pnpm build
   ```

3. Start the development servers

   ```sh
   pnpm dev
   ```

### Running the CLI

1. Follow the "setup the monorepo" steps.

2. Run the CLI

   ```sh
   node packages/cli/dist/index.js
   ```

   It will respond with the possible commands. A full example command would be:

   ```sh
   node packages/cli/dist/index.js sites list
   ```

## Contributing: Versions and Releases

### Generating a Changeset

To generate a new changeset, run `pnpm changeset` in the root of the repository.
The generated Markdown files in the `.changeset` directory should be committed
to the repository.

### Publishing New Versions

Version numbers are automatically semantically bumped by the `changeset` GitHub
Action.

### Releases

#### Stable Releases

To publish a new stable release, trigger the `release.yml` GitHub Action. A pull
request will be created with the changeset and the version bump. Once the pull
request is merged, the `release.yml` GitHub Action will publish the new version.

The published version will be tagged with the version number and installable
with the tag `latest`.

#### Canary Releases

To publish a new canary release, trigger the `release-canary.yml` GitHub Action.
A pull request will be created with the changeset and the version bump. Once the
pull request is merged, the `release-canary.yml` GitHub Action will publish the
new version.

The published version will be tagged with the version number and installable
with the tag `canary`.
