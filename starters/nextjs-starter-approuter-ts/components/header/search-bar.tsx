"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEventHandler, useState } from "react";
import CloseIcon from "../../assets/icons/close.svg";
import SearchIcon from "../../assets/icons/search.svg";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const searchParams = useSearchParams();
  const defaultSearchQuery = searchParams.get("q");

  return (
    <>
      {/* Mobile */}
      <Button
        variant="secondary"
        size="icon"
        className={cn("shrink-0 lg:hidden", defaultSearchQuery && "hidden")}
        onClick={() => setIsExpanded(true)}
      >
        <Image
          src={SearchIcon}
          alt="Search"
          title="Search"
          width={16}
          height={16}
        />
      </Button>
      <div
        className={cn(
          "absolute ml-auto flex items-center transition-all duration-300 ease-in-out",
          isExpanded
            ? "inset-0 z-50 bg-white px-4 py-4 sm:px-6 lg:px-12"
            : "h-0 w-0",
        )}
      >
        {isExpanded && (
          <Button
            variant="secondary"
            size="icon"
            className="shrink-0"
            onClick={() => setIsExpanded(false)}
          >
            <Image
              src={CloseIcon}
              alt="Close"
              title="Close"
              width={16}
              height={16}
            />
          </Button>
        )}

        <div
          className={cn(
            "ml-3 overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "w-full" : "w-0",
          )}
        >
          <SearchBarForm defaultSearchQuery={defaultSearchQuery} />
        </div>
      </div>

      {/* Desktop */}
      <div className={cn("hidden lg:flex", defaultSearchQuery && "flex")}>
        <SearchBarForm defaultSearchQuery={defaultSearchQuery} />
      </div>
    </>
  );
}

function SearchBarForm({
  defaultSearchQuery,
}: {
  defaultSearchQuery?: string | null | undefined;
}) {
  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const searchQuery = e.currentTarget.elements.namedItem(
      "search",
    ) as HTMLInputElement;

    window.location.href = `/search?q=${encodeURIComponent(searchQuery.value)}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex h-10 items-center overflow-hidden rounded-lg border border-neutral-400 text-neutral-900 transition-all duration-300 ease-in-out focus-within:border-neutral-900"
    >
      <input
        placeholder="Search"
        defaultValue={defaultSearchQuery || ""}
        className="h-full w-full border-r border-inherit bg-transparent px-4 outline-none sm:min-w-[291px]"
        required
        name="search"
      />
      <Button
        type="submit"
        size="icon"
        variant="secondary"
        className="rounded-none"
      >
        <Image
          src={SearchIcon}
          alt="Search"
          title="Search"
          width={16}
          height={16}
        />
      </Button>
    </form>
  );
}
