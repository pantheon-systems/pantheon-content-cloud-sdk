import React from "react";
import { Link } from "gatsby";

const NotFoundPage = () => {
  return (
    <main className="text-black px-96">
      <h1 className="mt-0 mb-64 max-w-[320px]">Page not found</h1>
      <p className="mb-48">
        Sorry 😔, we couldn’t find what you were looking for.
        <br />
        {process.env.NODE_ENV === "development" && (
          <>
            <br />
            Try creating a page in{" "}
            <code className="px-4 py-2 text-lg text-yellow-800 bg-yellow-200 rounded-md">
              src/pages/
            </code>
            .
            <br />
          </>
        )}
        <br />
        <Link to="/" className="font-bold text-blue-600 underline">
          Go home
        </Link>
        .
      </p>
    </main>
  );
};

export default NotFoundPage;

export const Head = () => <title>Not found</title>;
