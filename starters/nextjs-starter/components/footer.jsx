import Image from "next/image";
import React from "react";
import PantheonLogo from "../assets/logos/pantheon-fist.png";

export default function Footer() {
  return (
    <footer className="w-full p-[61.5px] mt-32 text-white bg-neutral-800">
      <div className="flex flex-col items-center w-fit text-center mx-auto">
        <Image src={PantheonLogo} alt="Pantheon Logo" width={64} height={64} />

        <h6 className="font-bold mt-3">Your Company Here</h6>
        <p>© Placeholder</p>

        <p className="mt-8">
          Built with{" "}
          <a
            href="https://pcc.pantheon.io"
            className="underline hover:text-neutral-300 hover:no-underline"
          >
            Pantheon Content Publisher
          </a>
        </p>
      </div>
    </footer>
  );
}
