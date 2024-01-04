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
# Login the user
$ pcc login

# Create project with nextjs template
$ pcc init new_proj

# Create project with gatsby template
$ pcc init new_proj --template=gatsby

# Create project using pnpm package manager
$ pcc init new_proj --use-pnpm

# Create Typescript project and setup ESLint in it
$ pcc init new_proj --ts --eslint

# Create project without installing dependencies
$ pcc init new_proj --noInstall

# Create project and provide site ID to pre-populate .env file with
$ pcc init new_proj --site-id 8YUsfuf1EhjLGhswM49q

# Create new token
$ pcc token create

# Create new site
$ pcc site create --url test-site.com

# Get webhooks event delivery logs for a site ID
$ pcc site webhooks history 8YUsfuf1EhjLGhswM49q

# Generate preview link for given document ID
$ pcc document preview 8MwijBYyp3B41slkdfjalkdfdziXkjyynTREdst8FauQ

# Get details of logged-in user
$ pcc whoami

# Logout the user
$ pcc logout

```
