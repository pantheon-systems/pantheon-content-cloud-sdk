<div align="center">
	<h1>Pantheon Content Cloud SDK for Browsers</h1>
	<p>
		<b>A simple and easy to use browser client for the Pantheon Content Cloud API</b>
	</p>
	<br>
</div>

## Requirements

1. A published Pantheon Content Cloud article
2. A Pantheon Content Cloud API key. Obtain one from the [PCC CLI](https://github.com/pantheon-systems/pantheon-content-cloud-sdk/tree/main/packages/cli#readme).

## Usage

1. Add the script tags that load the SDK to your HTML file:

```html
<-- Add this to the <head> of your HTML file or right before the closing </body> tag -->
<script
  src="https://unpkg.com/@pantheon-systems/pcc-browser-sdk@latest/dist/index.js"
  data-api-key="<your PCC API Key>"
  data-site-id="<your PCC Site ID>"
></script>
```

2. Add the `pcc-document` custom element to your HTML file. Place it where you want
   the article to be rendered.

```html
<pcc-document id="<id of your document>">
  <!-- Add a fallback message here for when the article is loading... -->
  Loading...
</pcc-document>
```

That's it! You should now see yur article rendered in your browser.

## Options

The `pcc-document` custom element accepts the following attributes:

| Attribute      | Type    | Required                  | Description                                      |
| -------------- | ------- | ------------------------- | ------------------------------------------------ |
| id             | String  | Yes                       | The ID of the document you want to render        |
| slug           | String  | Yes if id is not provided | The slug of the document you want to render      |
| disable-styles | Boolean | No                        | Disable rendering default styles for the article |
