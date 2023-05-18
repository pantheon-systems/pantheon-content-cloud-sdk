<div align="center">
	<h1>Pantheon Content Cloud SDK for React </h1>
	<p>
		<b>A simple and easy to use React client for the Pantheon Content Cloud API</b>
	</p>
	<br>
</div>

## Installation

```console
npm install @pcc/react
```

## Setup

```javascript
import { PantheonClient, PantheonProvider } from '@pcc/react';

// Create a client
const pantheonClient = new PantheonClient({
  pccHost: 'https://my-content-cloud-host.com', // URL to PCC instance
  pccWsHost: 'wss://my-content-cloud-host.com', // PCC Instance websocket URL, optional
});

// Wrap your app in the provider
function App() {
  return (
    // Pass the client to the provider
    <PantheonProvider client={pantheonClient}>
      <Blog />
    </PantheonProvider>
  );
}
```

## Usage

We provide a set of hooks to interact with the Pantheon Content Cloud API.

### useArticle

Fetch an article by ID.

```javascript
import { useArticle } from '@pcc/react';

function Article({ id }) {
  const { article, loading, error } = useArticle(id);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.body }} />
    </div>
  );
}
```

### useArticles

Fetch a list of available articles.

```javascript
import { useArticles } from '@pcc/react';

function Articles() {
  const { articles, loading, error } = useArticles();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {articles.map((article) => (
        <li key={article.id}>
          <a href={`/articles/${article.id}`}>{article.title}</a>
        </li>
      ))}
    </ul>
  );
}
```
