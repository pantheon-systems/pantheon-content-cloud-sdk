/**
 * @type {import('gatsby').GatsbyConfig}
 */

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

let gatsbyNodeModules = require('fs').realpathSync('node_modules/gatsby')
gatsbyNodeModules = require('path').resolve(gatsbyNodeModules, '..')

module.exports = {
//   onCreateWebpackConfig: ({ stage, actions }) => {

//     actions.setWebpackConfig({
//       resolve: {
//         modules: [gatsbyNodeModules, 'node_modules'],
//       },
//     })
    
//   }
// ,  
  siteMetadata: {
    title: `gatsby-pcc-starter`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    // {
    //   resolve: "gatsby-plugin-pnpm-gatsby-5",
    //   options: {
    //     // projectPath: path.dirname(__dirname), // use parent directory as project root
    //     // include: [
    //     //   `my-awesome-package`, // <- resolve this package name
    //     //   `path/to/my/private/webpack/loaders` // <- resolve from this directory
    //     // ],
    //     strict: false
    //   }
    // },
    "gatsby-plugin-pnpm-gatsby-5",
    "gatsby-plugin-postcss",
    "gatsby-plugin-mdx",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
  ],
};
