import renderer from 'react-test-renderer';

import { ArticleRenderer } from '../../src/components';
import article from '../data/article.json';

describe('<ArticleRenderer />', () => {
  it("should render a post's content", () => {
    const tree = renderer
      .create(<ArticleRenderer article={article} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
