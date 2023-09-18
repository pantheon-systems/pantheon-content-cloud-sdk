import Head from "next/head";
import Link from "next/link";

import Layout from "../../components/layout";

export default function AuthApiExampleTemplate({ menuItems, privatePosts }) {
  return (
    <Layout footerMenu={menuItems}>
      <Head>
        <title>API Authorization Example</title>
        <meta
          name="description"
          content="Generated by create-pantheon-decoupled-kit."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="prose lg:prose-xl mt-10 flex flex-col mx-auto max-h-screen">
        <h1>API Authorization Example</h1>

        <Link passHref href="/">
          <span className="w-full underline cursor-pointer">Home &rarr;</span>
        </Link>

        <div className="mt-12 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-screen-lg">
          {privatePosts?.length > 0 ? (
            <p>
              🎉 Next.js was able to successfully make an authenticated request
              to PCC! 🎉
            </p>
          ) : (
            <>
              <p>
                Next.js was unable to make an authorized request to the PCC API.
                Please check your .env.development.local file to ensure that
                your credentials are set correctly.
              </p>
              <p>
                For more information on how to set these values, please see{" "}
                <a href="#">Setting Environment Variables</a>
              </p>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  // Redirect to the homepage until this page is ready
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
}
