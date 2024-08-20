import { PCCConvenienceFunctions } from "@pantheon-systems/pcc-react-sdk";
import { NextSeo } from "next-seo";
import Image from "next/image";
import ArticleGrid from "../components/grid";
import Layout from "../components/layout";
import { Button } from "../components/ui/button";

export default function Home({ articles }) {
  return (
    <Layout>
      <NextSeo
        title="Pantheon Content Publisher Next.js Starter"
        description="A starter kit for building a Next.js site with Pantheon Content Publisher."
      />

      <section className="bg-neutral-100">
        <div className="flex flex-col xl:flex-row xl:gap-[139px] xl:items-center max-w-screen-3xl mx-auto py-0 3xl:px-12">
          <div className="mx-auto lg:mx-0 px-6 py-24 sm:max-w-[533px] sm:px-0 lg:pl-24 xl:ml-32 xl:pl-0 xl:py-0 xl:max-w-max">
            <p>WELCOME</p>
            <h1 className="my-3 text-5xl font-bold">
              Time to make this site your own.
            </h1>
            <p>
              Your new website is waiting to be built for something amazing.
              <br />
              What are you waiting for?
            </p>
            <div className="flex flex-wrap gap-4 mt-8 xl:flex-col 2xl:flex-row">
              <Button size="large" className="w-fit">
                Discover examples
              </Button>
              <Button size="large" className="w-fit" variant="secondary">
                Read our Docs
              </Button>
            </div>
          </div>
          <div className="relative w-full h-[490px] sm:h-[640px] xl:max-w-[900px]">
            <Image
              src="/images/hero.png"
              alt="Pantheon Logo"
              fill
              objectFit="cover"
            />
          </div>
        </div>
      </section>

      <section className="mt-32 max-w-screen-3xl mx-auto">
        <ArticleGrid articles={articles} showWide />
      </section>
    </Layout>
  );
}

export async function getServerSideProps() {
  const { data: articles } = await PCCConvenienceFunctions.getPaginatedArticles(
    {
      pageSize: 2,
    },
  );

  return {
    props: {
      articles,
    },
  };
}
