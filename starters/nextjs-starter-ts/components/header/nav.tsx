import * as Popover from "@radix-ui/react-popover";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { RemoveScroll } from "react-remove-scroll";
import CloseIcon from "../../assets/icons/close.svg";
import HamburgerMenuIcon from "../../assets/icons/hamburger-menu.svg";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export const navItems = {
  links: [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/articles",
      label: "Articles",
    },
  ],
  buttons: [
    {
      href: "https://pcc.pantheon.io/docs",
      label: "Docs",
      variant: "secondary",
    },
    {
      href: "/examples",
      label: "Examples",
      variant: "primary",
    },
  ],
} as const;

export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button variant="secondary" size="icon">
          {open ? (
            <Image
              src={CloseIcon}
              alt="Close"
              title="Close"
              width={16}
              height={16}
            />
          ) : (
            <Image
              src={HamburgerMenuIcon}
              alt="Hamburger Menu"
              title="Hamburger Menu"
              width={16}
              height={16}
            />
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className={cn(
          "z-50 pt-8 bg-white w-screen h-screen text-popover-foreground shadow-md outline-none",
          "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
          "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
        )}
        align="start"
      >
        <RemoveScroll>
          <div className="">
            <div className="p-default">
              <ul className="space-y-8">
                {navItems.links.map((link) => (
                  <NavItem key={link.href} href={link.href}>
                    {link.label}
                  </NavItem>
                ))}
              </ul>
            </div>

            <hr className="my-4 border-neutral-300" />

            <div className="space-y-8 p-default">
              {navItems.buttons.map((button) => (
                <Link className="block" href={button.href} key={button.href}>
                  <Button variant={button.variant}>{button.label}</Button>
                </Link>
              ))}
            </div>
          </div>
        </RemoveScroll>
      </Popover.Content>
    </Popover.Root>
  );
}

export function NavItem({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  const activePath = useRouter().pathname;

  return (
    <li>
      <Link
        href={href}
        className={cn("hover:underline", activePath === href && "font-bold")}
      >
        {children}
      </Link>
    </li>
  );
}
