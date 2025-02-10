# Pantheon Content Cloud Next.js Starter

## Getting Started

To get started with the Next Pantheon Content Cloud Starter, use our `pcc`
(command-line interface tool we have created). Full documentation for this npm
package based on [npm init](https://docs.npmjs.com/cli/v8/commands/npm-init) can
be found [here](https://www.npmjs.com/package/@pantheon-systems/pcc) on our docs
site.

##  ☁ Open in the Cloud 
[![Open in VS Code](https://img.shields.io/badge/Open%20in-VS%20Code-blue?logo=visualstudiocode)](https://vscode.dev/github/pantheon-systems/pantheon-content-cloud-sdk)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/pantheon-systems/pantheon-content-cloud-sdk)
[![Open in CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/embed/react-markdown-preview-co1mj?fontsize=14&hidenavigation=1&theme=dark)
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/pantheon-systems/pantheon-content-cloud-sdk)
[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/fork/github/pantheon-systems/pantheon-content-cloud-sdk/tree/main/starters/nextjs-starter)
[![Open in Repl.it](https://replit.com/badge/github/withastro/astro)](https://replit.com/github/pantheon-systems/pantheon-content-cloud-sdk)
[![Open in Glitch](https://img.shields.io/badge/Open%20in-Glitch-blue?logo=glitch)](https://glitch.com/edit/#!/import/github/pantheon-systems/pantheon-content-cloud-sdk)
[![Open in Codeanywhere](https://codeanywhere.com/img/open-in-codeanywhere-btn.svg)](https://app.codeanywhere.com/#https://github.com/pantheon-systems/pantheon-content-cloud-sdk)


For a quick start on your local machine, follow the instructions below:

1. In your terminal, run the following commands:

```bash
npm install @pantheon-systems/pcc-cli --global
pcc init ./my-new-site --template=nextjs
```

2. Follow the prompts in your terminal to complete the setup.

## Pantheon's @pantheon-systems/pcc-react-sdk

Pantheon's @pantheon-systems/pcc-react-sdk is included as a dependency in this
project.

## Tests

Tests are written with [`vitest`](https://vitest.dev/). All new functionality
should have unit tests or snapshot tests where applicable. Snapshot tests are
using
[`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro/).

### Commands

This section assumes the package manager in use is `npm`. If you are not using
`npm`, replace `npm` with the name of your package manager.

To run the tests:

```bash
npm test
```

To run the tests in watch mode:

```bash
npm run test:watch
```

### Updating Snapshots

Snapshots should be updated when presentational changes are made. If a new page
route is added, create a new snapshot test for it, and include any data needed
to run that test successfully. Please commit the updated snapshots along with
your changes.

To update a snapshot:

Run the following helper command:

```bash
npm run update-snapshots
```

Or, run the test for a single profile in watch mode (see above), then in the
terminal press the **u** key. This will update the snapshot for the running
profile Be sure to update the snapshot for both profiles.
