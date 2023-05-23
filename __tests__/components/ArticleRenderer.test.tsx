import renderer from 'react-test-renderer';

import { Article } from '../../src';
import { ArticleRenderer } from '../../src/components';
import article from '../data/article.json';

describe('<ArticleRenderer />', () => {
  it("should render a post's content", () => {
    const tree = renderer
      .create(<ArticleRenderer article={article as Article} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
