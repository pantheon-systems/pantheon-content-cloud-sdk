import Image from "next/image";
import { useState } from "react";
import CloseIcon from "../../assets/icons/close.svg";
import SearchIcon from "../../assets/icons/search.svg";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Mobile */}
      <Button
        variant="secondary"
        size="icon"
        className="shrink-0 lg:hidden"
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
          "flex items-center ml-auto transition-all duration-300 ease-in-out absolute",
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
            "transition-all duration-300 ease-in-out ml-3 overflow-hidden",
            isExpanded ? "w-full" : "w-0",
          )}
        >
          <SearchBarForm />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:flex">
        <SearchBarForm />
      </div>
    </>
  );
}

function SearchBarForm() {
  const [searchQuery, setSearchQuery] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className="h-10 border border-neutral-400 rounded-lg flex items-center text-neutral-900 overflow-hidden transition-all duration-300 ease-in-out focus-within:border-neutral-900"
    >
      <input
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="min-w-[291px] h-full w-full px-4 border-r outline-none border-inherit bg-transparent"
        required
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
