import { Header, Footer, PreviewRibbon } from "@pantheon-systems/nextjs-kit";
import Link from "next/link";

export default function Layout({ children, footerMenu, preview }) {
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
    <div className="min-h-screen max-h-screen min-w-screen max-w-screen flex flex-col overflow-x-hidden">
      {preview && <PreviewRibbon />}
      <div className="ps-my-0 ps-pt-10 ps-px-5 ps-text-xl">
        <nav>
          <ul className="ps-flex ps-flex-row ps-flex-wrap sm:ps-flex-nowrap ps-list-none ps-justify-between max-w-screen-lg ps-mx-auto">
            {navItems.map((item) => {
              return (
                <li
                  className={`${item.href === "/" ? "ps-mr-auto" : "ps-mx-4"}`}
                  key={item.href}
                >
                  <Link
                    className="ps-font-sans hover:ps-underline"
                    href={item.href}
                  >
                    {item.linkText}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <main className="mb-auto">{children}</main>
      <Footer footerMenuItems={footerMenuItems}>
        <span className="mx-auto">
          © {new Date().getFullYear()} Built with{" "}
          <a
            className="text-white hover:text-blue-100 underline"
            href="https://nextjs.org/"
          >
            Next.js
          </a>{" "}
          and{" "}
          <a
            className="text-blue-500 underline hover:text-blue-100"
            href="https://pantheon.com/"
          >
            Pantheon Content Cloud
          </a>
        </span>
      </Footer>
    </div>
  );
}
