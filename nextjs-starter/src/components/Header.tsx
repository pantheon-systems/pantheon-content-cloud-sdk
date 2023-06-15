import React from "react";
import Image from "next/image";

import Logo from "../assets/logo.svg";
import Link from "next/link";

export default function Header() {
  return (
    <div className="sticky top-0 flex items-center justify-center h-20 bg-black">
      <div className="flex items-center justify-between w-full px-4 m-auto max-w-7xl md:px-6">
        <Link href="/">
          <Image src={Logo} alt="Pantheon Logo" className="h-fit" />
        </Link>

        <a
          href="https://pantheon.io/register"
          rel="noopener noreferrer"
          target="_blank"
        >
          <button className="flex items-center justify-center h-8 px-6 py-6 font-medium text-black bg-pantheon-yellow">
            Try Pantheon
          </button>
        </a>
      </div>
    </div>
  );
}
