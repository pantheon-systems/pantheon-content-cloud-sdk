<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Pantheon Decoupled Kit Gatsby Pantheon Content Cloud Starter
</h1>

## Getting Started

To get started with the Gatsby Pantheon Content Cloud Starter, use our
`create-pantheon-decoupled-kit`, or the "CLI". Full documentation for this npm
package based on [npm init](https://docs.npmjs.com/cli/v8/commands/npm-init) can
be found
[here](https://decoupledkit.pantheon.io/docs/frontend-starters/using-the-cli) on
our docs site.

## Deploy your own

For a quick start on your local machine, follow the instructions below:

1. In your terminal, run the following command:

```bash
npm init pantheon-decoupled-kit -- gatsby-pcc
```

2. Follow the prompts in your terminal to complete the setup.

3. Start developing!

   Navigate into your new site’s directory and start it up.

   ```shell
   cd gatsby-pcc/
   npm run develop
   ```

4. Open the code and start customizing!

   Your site is now running at http://localhost:8000!

   Edit `src/pages/index.js` to see your site update in real-time!

5. Learn more

   - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
   - [Tutorials](https://www.gatsbyjs.com/docs/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
   - [Guides](https://www.gatsbyjs.com/docs/how-to/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
   - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
   - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)
   - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter)

## Serverside Rendering

This starter uses Gatsby's [createPages API](https://www.gatsbyjs.com/docs/creating-and-modifying-pages/) to pre-render the pages on the server. See `gatsby-node.mjs` file for the implementation details.

You could also use the provided client-side hooks in @pantheon-systems/pcc-react-sdk (`useArticles` and `useArticle`) to render the pages on the client.

## Pantheon @pantheon-systems/gatsby-kit and @pantheon-systems/pcc-react-sdk

Pantheon's @pantheon-systems/gatsby-kit and @pantheon-systems/pcc-react-sdk are included as dependencies in this project. This allows developers to make use of utility functions to simplify the
process of building and maintaining a Front-End site on Pantheon.

Full documentation can be found at:
https://github.com/pantheon-systems/decoupled-kit-js/tree/canary/web/docs/Packages
