import React from "react";

export const Tags = ({ tags }) => {
  return (
    <div className="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
      {tags?.length ? (
        <>
          Tags:&nbsp;
          {tags.map((x, i) => (
            <div key={x} className="inline">
              {x.toString()}
              {i < tags.length - 1 ? ", " : undefined}
            </div>
          ))}
        </>
      ) : (
        <span className="font-normal">Tags: none</span>
      )}
    </div>
  );
};
