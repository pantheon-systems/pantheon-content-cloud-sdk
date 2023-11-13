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
