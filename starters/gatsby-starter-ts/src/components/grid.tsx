import { Link } from "gatsby";
import React from "react";
import { Tags } from "./tags";

const GradientPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-500" />
);

interface Props {
  href: string;
  imgSrc: string;
  altText?: string;
  tags?: string[];
  title: string;
}

const GridItem = ({ href, imgSrc, altText, tags, title }: Props) => {
  return (
    <>
      <div className="flex flex-col h-full overflow-hidden rounded-lg shadow-lg">
        <Link to={href}>
          <div className="relative flex-shrink-0 h-40 cursor-pointer hover:border-indigo-500 border-2s not-prose">
            {imgSrc != null ? (
              <img
                src={imgSrc}
                alt={altText || title}
                className="object-cover w-full h-full"
              />
            ) : (
              <GradientPlaceholder />
            )}
          </div>
        </Link>
        <div className="mx-6 my-4 text-xl font-semibold leading-7 text-gray-900">
          <Link to={href}>
            <div className="hover:scale-105">{title} &rarr;</div>
          </Link>
          <Tags tags={tags || []} />
        </div>
      </div>
    </>
  );
};

const PostGridItem = ({ content: article }) => {
  return (
    <GridItem
      href={`/articles/${article.slug || article.id}`}
      imgSrc={article.metadata?.["image"]}
      title={article.title}
      tags={article.tags}
    />
  );
};

const PageGridItem = ({ content: article }) => {
  return (
    <GridItem
      href={`/articles/${article.slug || article.id}`}
      imgSrc={article.metadata?.["image"]}
      title={article.title}
      tags={article.tags}
    />
  );
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
  data: any[] | null;
  FallbackComponent?: any | null | undefined;
}

export const withGrid = (Component) => {
  const GriddedComponents = ({
    data,
    FallbackComponent,
    ...props
  }: GriddedComponentProps & any) => {
    return (
      <>
        {data ? (
          <Grid>
            {data.map((content, i) => {
              return <Component key={i} content={content} {...props} />;
            })}
          </Grid>
        ) : FallbackComponent ? (
          FallbackComponent
        ) : null}
      </>
    );
  };

  return GriddedComponents;
};

export const PostGrid = withGrid(PostGridItem);
export const PageGrid = withGrid(PageGridItem);
