import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import SearchBar from "./search-bar";

export default function Header() {
  return (
    <header className="flex justify-between w-full px-12 py-4">
      <nav className="flex gap-4">
        <Image
          src="/pantheon-logo-black.png"
          alt="Pantheon Logo"
          width={40}
          height={40}
        />
        <ul className="flex items-center gap-8">
          <NavItem href="/">Home</NavItem>
          <NavItem href="/articles">Articles</NavItem>
        </ul>
      </nav>

      <nav className="flex gap-4">
        <SearchBar />
        <a href="https://pcc.pantheon.io/docs">
          <Button variant="secondary" size="small">
            Docs
          </Button>
        </a>
        <Link href="/examples">
          <Button variant="primary" size="small">
            Examples
          </Button>
        </Link>
      </nav>
    </header>
  );
}

function NavItem({ href, children }: { href: string; children: string }) {
  const activePath = useRouter().pathname;

  return (
    <li>
      <Link href={href} className={cn(activePath === href ? "font-bold" : "")}>
        {children}
      </Link>
    </li>
  );
}
