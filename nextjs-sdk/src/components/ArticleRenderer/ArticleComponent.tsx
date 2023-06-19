import * as React from 'react';

import { getStyleObjectFromString } from '../../utils/styles';
import { unescapeHTMLEntities } from '../../utils/unescape';

const ArticleComponent = ({ x }: any): React.ReactElement | null => {
  if (Array.isArray(x)) {
    return (
      <>
        {x.map((span: any, idx) => (
          // No stable key available
          // eslint-disable-next-line react/no-array-index-key
          <ArticleComponent x={span} key={idx} />
        ))}
      </>
    );
  }
  if (x == null) return null;

  const textContent = typeof x === 'string' ? x : x.data;
  const styles = getStyleObjectFromString(x?.style || '');
  const isSuperscript = Boolean(styles['vertical-align'] === 'super');
  const isSubscript = Boolean(styles['vertical-align'] === 'sub');

  const articleComponents = ['li', 'tr', 'td'];

  if (articleComponents.includes(x.tag)) {
    return React.createElement(
      x.tag,
      { style: styles, ...x.attrs },
      React.createElement(ArticleComponent, { x: x.children }),
    );
  }

  if (textContent != null) {
    const tag = isSuperscript ? 'sup' : isSubscript ? 'sub' : 'span';
    return React.createElement(
      tag,
      { style: styles },
      unescapeHTMLEntities(textContent),
    );
  }

  if (x.tag === 'span' && x.data == null) {
    return (
      <span>
        <ArticleComponent x={x.children} />
      </span>
    );
  }

  if (x.tag === 'p') {
    return <TopLevelElement element={x} />;
  }

  if (x.tag === 'a') {
    return (
      <a href={x.href} target="_blank" rel="noopener noreferrer" style={styles}>
        {x.data}
      </a>
    );
  }
  if (x.tag === 'img' || x.tag === 'image') {
    return <img src={x.src} alt={x.alt} title={x.title} />;
  }

  if (x.type === 'BLOCKQUOTE') {
    return (
      <blockquote>
        <p dir="ltr">QUOTE TEXT</p>
        <p dir="ltr">-&nbsp;QUOTE ATTRIBUTION</p>
      </blockquote>
    );
  }

  return null;
};

export default ArticleComponent;

const TopLevelElement = ({ element }: any) => {
  if (element.tag === 'hr') {
    return <hr />;
  }

  const children = <ArticleComponent x={element.children} />;

  const articleComponents = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  if (articleComponents.includes(element.tag)) {
    return React.createElement(element.tag, { ...element.attrs }, children);
  }

  if (element.tag === 'table') {
    return (
      <table className="text-black">
        <tbody>{children}</tbody>
      </table>
    );
  }

  if (element.tag === 'p' || element.tag === 'span') {
    return <p>{children}</p>;
  }
  if (element.tag === 'ul' && element.children.length) {
    return <ul>{children}</ul>;
  }
  if (element.tag === 'ol' && element.children.length) {
    return <ol>{children}</ol>;
  }
  if (element.tag === 'component') {
    return <ArticleComponent x={element} />;
  }
  return null;
};
