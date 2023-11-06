import { withGrid } from "@pantheon-systems/nextjs-kit";
import Image from "next/image";
import Link from "next/link";
import { Tags } from "./tags";

const GradientPlaceholder = () => (
  <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-500" />
);

const GridItem = ({ href, imgSrc, altText, tags, title }) => {
  return (
    <>
      <div className="flex flex-col rounded-lg shadow-lg overflow-hidden h-full">
        <Link passHref href={href}>
          <div className="flex-shrink-0 relative h-40 hover:border-indigo-500 cursor-pointer border-2s">
            {imgSrc !== null ? (
              <Image
                src={imgSrc}
                fill
                alt={altText || title}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <GradientPlaceholder />
            )}
          </div>
        </Link>
        <div className="my-4 mx-6 text-xl leading-7 font-semibold text-gray-900">
          <Link passHref href={href}>
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
