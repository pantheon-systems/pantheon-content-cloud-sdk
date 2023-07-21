export const Tags = ({ tags }) => {
  return (
    <p className="mt-2 text-sm leading-[1.25rem] text-theme-bg-black">
      {tags.length ? (
        <>
          Tags:&nbsp;
          {tags.map((x, i) => (
            <span key={x}>
              <a
                className="text-bold underline hover:text-blue-500 underline-offset-4"
                href={`/tags?q=${encodeURIComponent(x)}`}
              >
                {x}
              </a>
              {i < tags.length - 1 ? ", " : undefined}
            </span>
          ))}
        </>
      ) : (
        <span className="font-normal">Tags: none</span>
      )}
    </p>
  );
};
