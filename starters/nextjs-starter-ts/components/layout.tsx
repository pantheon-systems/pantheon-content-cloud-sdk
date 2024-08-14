import Link from "next/link";
import { Footer } from "./footer";
import Header from "./header";

interface Props {
  children: React.ReactNode;
  footerMenu?: [
    {
      path: string;
      label: string;
    },
  ];
}

export default function Layout({ children, footerMenu }: Props) {
  const navItems = [
    {
      linkText: "🏠 Home",
      href: "/",
    },
    {
      linkText: "📑 Articles",
      href: "/articles",
    },
    {
      linkText: "⚛️ Examples",
      href: "/examples",
    },
  ];

  const footerMenuItems = footerMenu?.map(({ path, label }) => ({
    linkText: label,
    href: path,
    parent: null,
  }));

  return (
    <div className="flex flex-col max-h-screen min-h-screen overflow-x-hidden min-w-screen max-w-screen">
      <Header />
      <main className="mb-auto">{children}</main>
      <Footer footerMenuItems={footerMenuItems}>
        <span className="mx-auto">
          © {new Date().getFullYear()} Built with{" "}
          <a
            className="text-white underline hover:text-blue-100"
            href="https://nextjs.org/"
          >
            Next.js
          </a>{" "}
          and{" "}
          <a
            className="text-blue-500 underline hover:text-blue-100"
            href="https://pantheon.io/"
          >
            Pantheon Content Cloud
          </a>
        </span>
      </Footer>
    </div>
  );
}
