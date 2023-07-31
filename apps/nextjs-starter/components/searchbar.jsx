import { useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames";
import { atom, useAtom } from "jotai";

export const searchQueryAtom = atom("");

export const Searchbar = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);

  return (
    <div>
      <input
        className={classNames(
          "border-black border-[1px] rounded-lg transition-all px-4 py-2 text-sm outline-none mt-[-8px]",
          {
            "w-8 cursor-pointer": !isFocused && !searchQuery?.trim().length,
            "w-64": isFocused || searchQuery?.trim().length,
          }
        )}
        type="search"
        placeholder={isFocused ? "Search" : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push({
              pathname: "/search",
              query: {
                q: searchQuery,
              },
            });
          }
        }}
      />
    </div>
  );
};
