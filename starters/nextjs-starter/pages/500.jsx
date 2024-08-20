import Image from "next/image";
import Link from "next/link";
import Layout from "../components/layout";
import { Button } from "../components/ui/button";
import { NextSeo } from "next-seo";

export default function Custom500() {
  return (
    <Layout>
      <NextSeo
        title="Internal server error"
        description="An error occurred while processing your request. Try again or return to homepage."
      />

      <div className="flex flex-col xl:flex-row xl:gap-[139px] xl:items-center max-w-screen-3xl mx-auto py-0 3xl:px-12">
        <div className="mx-auto md:mx-0 px-6 mt-24 mb-32 xl:mt-0 xl:mb-0 sm:max-w-[600px] md:ml-24 xl:ml-32 xl:pl-0 xl:py-0 xl:max-w-max">
          <div>
            <h1 className="text-5xl leading-[3.39rem] font-bold">500</h1>
            <h2 className="text-5xl leading-[3.39rem] font-bold mt-3">Internal server error</h2>
            <p className="text-xl leading-[1.875rem] mt-3">
              An error occurred while processing your request. Try again or return to homepage.
            </p>
          </div>
          <div className="flex gap-4 mt-8 flex-wrap">
            <Link href="https://pcc.pantheon.io/docs">
              <Button size="large">Go to Documentation</Button>
            </Link>
            <Link href="https://pantheon.io/support">
              <Button variant="secondary" size="large">
                Contact support
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative w-full h-[490px] sm:h-[640px] xl:max-w-[900px]">
          <Image
            src="/images/error.png"
            alt="Pantheon Logo"
            fill
            objectFit="contain"
            className="grayscale"
          />
        </div>
      </div>
    </Layout>
  );
}
