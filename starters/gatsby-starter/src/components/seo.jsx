const defaultMeta = {
  type: "website",
  robots: "follow, index",
};

export default function Seo({ title, description, tags, authors, date }) {
  const meta = {
    ...defaultMeta,
    title,
    description,
    authors,
    tags,
    date,
  };
  return (
    <head>
      <title>{meta.title}</title>
      <meta name="robots" content={meta.robots} />
      <meta content={meta.description} name="description" />
      {/* Open Graph */}
      <meta property="og:type" content={meta.type} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      {/* Twitter */}
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      {meta.date && (
        <meta property="article:published_time" content={meta.date} />
      )}
      {meta.authors && (
        <>
          {meta.authors.map((a) => (
            <meta property="article:author" content={a} />
          ))}
        </>
      )}
      {meta.tags && (
        <>
          {meta.tags.map((t) => (
            <meta property="article:tag" content={t} />
          ))}
        </>
      )}
      <meta name="theme-color" content="#ffffff" />
    </head>
  );
}