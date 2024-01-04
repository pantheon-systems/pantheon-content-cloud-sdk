<div align="center">
	<h1>PCC Toolkit</h1>
	<p>
		<b>Pantheon Content Cloud toolkit for setting up projects.</b>
	</p>
	<br>
</div>

## Installation

npm

```console
npm install @pantheon-systems/pcc-cli --global
```

yarn

```console
yarn add @pantheon-systems/pcc-cli --global
```

## Usage

```bash
$ # Show Help
$ pcc init --help
pcc init <project_directory> [options]

Sets up project with required files.

Positionals:
  <project_directory>  The project directory in which setup should be done.
                                                                        [string]

Options:
  --version   Show version number                                      [boolean]
  --help      Show help                                                [boolean]
  --template  Template from which files should be copied.
                               [string] [required] [choices: "nextjs", "gatsby", "vue"]

$ # Create project with nextjs template (this is  default)
$ pcc init new_proj
✔ Fetched starter kit!
✔ Completed setting up project!

To get started please run:
   cd new_proj

   # Set your site id and API key
   vim .env.local

   # Run the site
   yarn dev

$ # Create project with gatsby template
$ pcc init new_proj --template=gatsby
✔ Fetched starter kit!
✔ Completed setting up project!

To get started please run:
   cd new_proj

   # Set your site id and API key
   vim .env.development

   # Run the site
   yarn start

$ # Retrieve component schema from your playground site
$ pcc site components --url https://live-collabcms-fe-demo.appa.pantheon.site --apiPath /api/YOUR_SITE_ID/pantheoncloud/component_schema

$ # Retrieve component schema from your site (replace www.example.com)
$ pcc site components --url https://www.example.com

```

## Create site from Vue template

```bash
$ pcc init my-vue-site --template=vue
```

## Create site from Gatsby template

```bash
$ pcc init my-gatsby-site --template=gatsby
```

## Example of creating a site and API key for it

```bash
$ pcc site create --url https://www.example.com
✔ Successfully created the site with given details. Id: THE_NEW_SITE_ID

$ pcc token create
✔ Successfully created token for your user.

Token: TOKEN-SECRET-GUID-DONT-SHARE-THIS

# You can use THE_NEW_SITE_ID as the value of PCC_SITE_ID and TOKEN-SECRET-GUID-DONT-SHARE-THIS for PCC_API_KEY
```

## Import existing content from a Drupal site

You must ensure that the JSON API for your Drupal site is enabled (which it should be by default). https://www.drupal.org/docs/core-modules-and-themes/core-modules/jsonapi-module/api-overview

Once you've ensured that it's working, you will need to determine the URL which PCC can use to get the initial results page of posts (e.g. https://example.com/jsonapi/node/article). But please note that the exact URL will depend on which resource type(s) you want to import.

The second and last piece of information you will need before proceeding to import, is the id of the PCC site which the posts should be imported into. Posts are NOT going to be published automatically after importing, but they will be automatically connected to the site id provided.

With this information, you can now run the import command.

```bash
$ pcc import drupal https://example.com/jsonapi/node/article siteid12345
```
