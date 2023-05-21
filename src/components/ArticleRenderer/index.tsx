import { Article } from '../../types';

import ArticleComponent from './ArticleComponent';
import TopLevelElement from './TopLevelElement';

interface Props {
  article?: Article;
  bodyClassName?: string;
  containerClassName?: string;
  headerClassName?: string;
}

const ArticleRenderer = ({
  article,
  headerClassName,
  bodyClassName,
  containerClassName,
}: Props) => {
  const parsedBody: any[] = article?.content ? JSON.parse(article.content) : [];
  const indexOfFirstParagraph = parsedBody.findIndex((x) =>
    ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'p'].includes(x.tag),
  );

  const [titleElement] = parsedBody.splice(indexOfFirstParagraph, 1);

  return (
    <div className={containerClassName}>
      <div id="elem" className={headerClassName}>
        {titleElement ? (
          <ArticleComponent x={titleElement.children} />
        ) : (
          article?.title
        )}
      </div>
      <div className={bodyClassName}>
        {parsedBody?.map((x: any, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <TopLevelElement element={x} key={idx} keyElem={idx} />
        ))}
      </div>
    </div>
  );
};

export default ArticleRenderer;
