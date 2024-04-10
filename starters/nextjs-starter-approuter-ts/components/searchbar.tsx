"use client";

import classNames from "classnames";
import { atom, useAtom } from "jotai";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export const searchQueryAtom = atom("");

// Adapted from https://nextjs.org/docs/app/api-reference/functions/use-search-params
const useCreateQueryString = () => {
  const searchParams = useSearchParams();

  return useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
};

export const Searchbar = () => {
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const createQueryString = useCreateQueryString();

  return (
    <div>
      <input
        className={classNames(
          "border-black border-[1px] rounded-lg transition-all px-4 py-2 text-sm outline-none mt-[-8px]",
          {
            "w-8 cursor-pointer": !isFocused && !searchQuery?.trim().length,
            "w-64": isFocused || searchQuery?.trim().length,
          },
        )}
        type="search"
        placeholder={isFocused ? "Search" : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push("/search?" + createQueryString("q", searchQuery));
          }
        }}
      />
    </div>
  );
};
