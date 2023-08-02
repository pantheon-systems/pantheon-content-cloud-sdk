import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown.js';
import rehypeRaw from 'rehype-raw';

import { Article } from '../../types';

import ArticleComponent from './ArticleComponent';
import TopLevelElement from './TopLevelElement';
import { PreviewBar } from '../Preview/Preview';

interface Props {
  article?: Article;
  bodyClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
  renderTitle?: (titleElement: React.ReactElement) => React.ReactNode;
}

const ArticleRenderer = ({
  article,
  headerClassName,
  bodyClassName,
  containerClassName,
  renderTitle,
}: Props) => {
  const [renderCSR, setRenderCSR] = React.useState(false);

  useEffect(() => {
    setRenderCSR(true);
  }, []);

  const contentType = article?.contentType;

  if (contentType === 'TEXT_MARKDOWN') {
    return (
      <div className={containerClassName}>
        {article?.content ? (
          <ReactMarkdown rehypePlugins={[rehypeRaw]}>
            {String(article.content)}
          </ReactMarkdown>
        ) : (
          <span>No content to display</span>
        )}
      </div>
    );
  }

  const parsedBody: any[] = article?.content ? JSON.parse(article.content) : [];
  const indexOfFirstHeader = parsedBody.findIndex((x) =>
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'title'].includes(x.tag),
  );

  const indexOfFirstParagraph = parsedBody.findIndex((x) => x.tag === 'p');
  const resolvedTitleIndex =
    indexOfFirstHeader === -1 ? indexOfFirstParagraph : indexOfFirstHeader;

  const [titleElement] = parsedBody.splice(resolvedTitleIndex, 1);

  const titleComponent = titleElement ? (
    <ArticleComponent x={titleElement.children} />
  ) : (
    <span>{article?.title}</span>
  );

  return (
    <div className={containerClassName}>
      {renderCSR && article != null
        ? createPortal(<PreviewBar id={article.id} />, document.body)
        : null}
      <div className={headerClassName}>
        {renderTitle ? renderTitle(titleComponent) : titleComponent}
      </div>
      <div className={bodyClassName}>
        {parsedBody?.map((x: any, idx) => (
          // No stable key available
          // eslint-disable-next-line react/no-array-index-key
          <TopLevelElement element={x} key={idx} keyElem={idx} />
        ))}
      </div>
    </div>
  );
};

export default ArticleRenderer;
