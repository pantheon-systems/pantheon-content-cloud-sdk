<div align="center">
	<h1>Pantheon Content Cloud SDK for React </h1>
	<p>
		<b>A simple and easy to use React client for the Pantheon Content Cloud API</b>
	</p>
	<br>
</div>

## Installation

```console
npm install @pantheon-systems/pcc-react-sdk
```

## Setup

```javascript
import {
  PantheonClient,
  PantheonProvider,
} from "@pantheon-systems/pcc-react-sdk";

// Create a client
const pantheonClient = new PantheonClient({
  pccHost: "https://my-content-cloud-host.com", // URL to PCC instance
  pccWsHost: "wss://my-content-cloud-host.com", // PCC Instance websocket URL, optional
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

We provide a set of helpers in the form of API helpers, React hooks and React
helper components to get you up and running with the Pantheon Content Cloud API.

### React Components

#### Article Renderer

The `<ArticleRenderer />` component will render the article received from
Content Cloud by converting the raw article data into React elements you can
style and render in your app.

```javascript
import { ArticleRenderer } from "@pantheon-systems/pcc-react-sdk";

function ArticlePage({ id }) {
  const { article } = useArticle(id);

  return (
    <main>
      {
        // Render the article
        article && <ArticleRenderer article={article} />
      }
    </main>
  );
}
```

### React Hooks

#### useArticle

Fetch an article by ID.

```javascript
import { useArticle } from "@pantheon-systems/pcc-react-sdk";

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

#### useArticles

Fetch a list of available articles.

```javascript
import { useArticles } from "@pantheon-systems/pcc-react-sdk";

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

### API Helpers

These helpers are used to fetch data from the Pantheon Content Cloud API outside
of the React component lifecycle.

They are useful for fetching data in server-side rendered applications or in
other contexts where React hooks cannot be used.

#### getArticle

Fetch an article by ID.

```javascript
import { getArticle } from "@pantheon-systems/pcc-react-sdk";

// In Next.js getServerSideProps for example

export async function getServerSideProps({ params }) {
  const article = await getArticle(
    pantheonClient, // The PantheonClient instance initialized in [Setup](#Setup)
    params.id,
  );

  return {
    props: {
      article,
    },
  };
}
```

#### getArticles

Fetch a list of available articles, excluding their content.

```javascript
import { getArticles } from "@pantheon-systems/pcc-react-sdk";

// In Next.js getStaticPaths for example
export async function getStaticPaths() {
  const articles = await getArticles(pantheonClient); // The PantheonClient instance initialized in [Setup](#Setup)

  const paths = articles.map((article) => ({
    params: { slug: article.id },
  }));

  return {
    paths,
    fallback: true,
  };
}
```
