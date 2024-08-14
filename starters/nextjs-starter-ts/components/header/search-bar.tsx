import Image from "next/image";
import { FormEventHandler, useState } from "react";
import SearchIcon from "../../assets/icons/search.svg";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    // Redirect to search page with query
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "h-10 border-neutral-400 border rounded-lg flex items-center text-neutral-900",
        "transition-colors focus-within:border-neutral-900 overflow-clip",
      )}
    >
      <input
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-full px-4 border-r outline-none border-inherit"
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
          className=""
        />
      </Button>
    </form>
  );
}
