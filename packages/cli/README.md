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
npm install @pantheon-systems/pcc --global
```

yarn

```console
yarn add @pantheon-systems/pcc --global
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
                               [string] [required] [choices: "nextjs", "gatsby"]

$ # Create project with nextjs template
$ pcc init new_proj --template=nextjs
✔ Fetched starter kit!
✔ Completed setting up project!

To get started please run:
   cd new_proj
   PCC_HOST=<host_name> yarn dev

$ # Create project with gatsby template
$ pcc init new_proj --template=gatsby
✔ Fetched starter kit!
✔ Completed setting up project!

To get started please run:
   cd new_proj
   yarn start

$ # Retrieve component schema from your playground site
$ pcc site components --url https://live-collabcms-fe-demo.appa.pantheon.site --apiPath /api/YOUR_SITE_ID/pantheoncloud/component_schema

$ # Retrieve component schema from your site (replace www.example.com)
$ pcc site components --url https://www.example.com
$
```
