import { Link } from "gatsby";
import React, { ReactElement } from "react";

const GradientPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-500" />
);

interface Props {
  href: string;
  imgSrc?: string | undefined;
  altText?: string | undefined;
  title: string;
}

const GridItem = ({ href, imgSrc, altText, title }: Props) => {
  return (
    <Link to={href}>
      <div className="flex flex-col h-full overflow-hidden border-2 rounded-lg shadow-lg cursor-pointer hover:border-indigo-500">
        <div className="relative flex-shrink-0 h-40">
          {imgSrc !== null ? (
            <img src={imgSrc} alt={altText} style={{ objectFit: "cover" }} />
          ) : (
            <GradientPlaceholder />
          )}
        </div>
        <h2 className="mx-6 my-4 text-xl font-semibold leading-7 text-gray-900">
          {title} &rarr;
        </h2>
      </div>
    </Link>
  );
};

const PostGridItem = ({ content: article }) => {
  return <GridItem href={`/articles/${article.id}`} title={article.title} />;
};

const PageGridItem = ({ content: article }) => {
  return <GridItem href={`/articles/${article.id}`} title={article.title} />;
};

export const Grid = ({ children }) => {
  return (
    <div
      className={`mt-12 grid gap-5 max-w-content mx-auto lg:max-w-screen-lg lg:grid-cols-3`}
    >
      {children}
    </div>
  );
};

interface GriddedComponentProps {
  data: any[];
  FallbackComponent?: JSX.Element | undefined;
}

export const withGrid = (Component) => {
  const GriddedComponents = ({
    data,
    FallbackComponent,
    ...props
  }: GriddedComponentProps) => {
    return (
      <>
        {data ? (
          <Grid>
            {data.map((content, i) => {
              return <Component key={i} content={content} {...props} />;
            })}
          </Grid>
        ) : FallbackComponent ? (
          <FallbackComponent />
        ) : null}
      </>
    );
  };

  return GriddedComponents;
};

export const PostGrid = withGrid(PostGridItem);
export const PageGrid = withGrid(PageGridItem);
