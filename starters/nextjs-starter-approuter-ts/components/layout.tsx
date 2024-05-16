import Link from "next/link";
import { Footer } from "./footer";
import { Searchbar } from "./searchbar";

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
  ];

  const footerMenuItems = footerMenu?.map(({ path, label }) => ({
    linkText: label,
    href: path,
    parent: null,
  }));

  return (
    <div className="flex flex-col max-h-screen min-h-screen overflow-x-hidden min-w-screen max-w-screen">
      <div className="px-5 pt-10 my-0 text-xl">
        <nav>
          <ul className="flex flex-row flex-wrap justify-between max-w-screen-lg mx-auto list-none sm:flex-nowrap">
            {navItems.map((item) => {
              return (
                <li
                  className={`${item.href === "/" ? "mr-auto" : "mx-4"}`}
                  key={item.href}
                >
                  <Link
                    className="font-sans hover:underline"
                    href={item.href}
                  >
                    {item.linkText}
                  </Link>
                </li>
              );
            })}
            <div>
              <Searchbar />
            </div>
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
            href="https://pantheon.io/"
          >
            Pantheon Content Cloud
          </a>
        </span>
      </Footer>
    </div>
  );
}
