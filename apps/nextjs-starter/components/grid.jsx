import Link from "next/link";
import Image from "next/image";
import { Tags } from "./tags";
import { withGrid } from "@pantheon-systems/nextjs-kit";

const GradientPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-500" />
);

const GridItem = ({ href, imgSrc, altText, tags, title }) => {
  return (
    <Link passHref href={href}>
      <div className="flex flex-col rounded-lg shadow-lg overflow-hidden cursor-pointer border-2 h-full hover:border-indigo-500">
        <div className="flex-shrink-0 relative h-40">
          {imgSrc !== null ? (
            <Image
              src={imgSrc}
              fill
              alt={altText}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <GradientPlaceholder />
          )}
        </div>
        <h2 className="my-4 mx-6 text-xl leading-7 font-semibold text-gray-900">
          {title} &rarr;
          <Tags tags={tags || []} />
        </h2>
      </div>
    </Link>
  );
};

const PostGridItem = ({ content: article }) => {
  return (
    <GridItem
      href={`/articles/${article.id}`}
      imgSrc={null}
      title={article.title}
      tags={article.tags}
    />
  );
};

const PageGridItem = ({ content: article }) => {
  return (
    <GridItem
      href={`/articles/${article.id}`}
      imgSrc={null}
      title={article.title}
      tags={article.tags}
    />
  );
};

export const PostGrid = withGrid(PostGridItem);
export const PageGrid = withGrid(PageGridItem);
