<div align="center">
	<h1>Pantheon Content Cloud SDK for Vue.js</h1>
	<p>
		<b>A simple and easy to use Vue client for the Pantheon Content Cloud API</b>
	</p>
	<br>
</div>

## Installation

```console
npm install @pcc/vue
```

## Setup

Initialize the Pantheon Content Cloud plugin with your PCC instance URL and site identifier.

```javascript
import { pccPlugin } from "@pcc/vue";

createApp(App)
  // Install the plugin
  .use(pccPlugin, {
    pccHost: import.meta.env.VITE_PCC_HOST, // URL to PCC instance
    siteId: import.meta.env.VITE_PCC_SITE_ID, // PCC Instance websocket URL, optional
  })
  .mount("#app");
```

## Usage

This package exports composables and helper components to get you up and running with the Pantheon Content Cloud API.

### Components

#### Article Renderer

The `<ArticleRenderer />` component will render the article received from
Content Cloud by converting the raw article data into HTML elements you can style and render in your app.

```vue
<script setup>
import { useArticle } from "@pcc/vue";
import { ArticleRenderer } from "@pcc/vue/components";

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { result, loading, error } = useArticle(id);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-if="error">{{ error }}</div>
  <div v-if="result">
    <h1>{{ result.article.title }}</h1>
    <ArticleRenderer :article="result.article" />
  </div>
</template>
```

### Composables

All composables use the [`Vue Apollo` library](https://v4.apollo.vuejs.org/) under the hood and return the same `result`, `loading`, `error` refs among [other properties](https://v4.apollo.vuejs.org/api/use-query.html#return).

#### useArticle

Fetch an article by ID.

```vue
<script setup>
import { useArticle } from "@pcc/vue";
import { ArticleRenderer } from "@pcc/vue/components";

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { result, loading, error } = useArticle(id);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-if="error">{{ error }}</div>
  <div v-if="result">
    <h1>{{ result.article.title }}</h1>
    <ArticleRenderer :article="result.article" />
  </div>
</template>
```

#### useArticles

Fetch a list of available articles. This query does not include the article content.

```vue
<script setup>
import { useArticles } from "@pcc/vue";

const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { result, loading, error } = useArticle(id);
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-if="error">{{ error }}</div>
  <template v-if="result">
    <div v-for="article in result.articles" :key="article.id">
      <h1>{{ article.title }}</h1>
      <p>{{ article.tags.join(", ") }}</p>
    </div>
  </template>
</template>
```
