import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import PantheonLogoBlack from "../../assets/logos/pantheon-fist-black.png";
import { Button } from "../ui/button";
import NavMenu, { NavItem, navItems } from "./nav";
import SearchBar from "./search-bar";

export default function Header() {
  return (
    <header className="flex w-full p-default relative items-center justify-between">
      <nav className="flex gap-8 shrink-0">
        <Link href="/">
          <Image
            src={PantheonLogoBlack}
            alt="Pantheon Logo"
            width={40}
            height={40}
          />
        </Link>
        <ul className="items-center hidden gap-8 lg:flex">
          {navItems.links.map((link) => (
            <NavItem key={link.href} href={link.href}>
              {link.label}
            </NavItem>
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-3">
        <SearchBar />

        <nav className="hidden gap-3 lg:flex">
          {navItems.buttons.map((button) => (
            <Link href={button.href} key={button.href}>
              <Button variant={button.variant} size="small">
                {button.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="flex lg:hidden shrink-0">
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
