import { forwardRef } from "react";

interface Props {
  title: string;
  body: string;
}

const LeadCapture = forwardRef<HTMLDivElement>(function (
  { title, body }: Props,
  ref,
) {
  return (
    <div className="w-full p-1">
      <div
        className="max-w-[300px] w-full outline outline-black/10 p-4 rounded-md"
        ref={ref}
      >
        <h1 className="font-medium">{title ?? "Title"}</h1>
        <p className="my-4 text-sm">{body ?? "Body"}</p>
        <div className="pt-2">
          <input className="w-full p-2 border rounded-md border-black/10" />
        </div>
        <button className="px-4 py-2 mt-4 text-sm transition-opacity duration-200 rounded bg-[#FFDC28] hover:opacity-50">
          Submit
        </button>
      </div>
    </div>
  );
});

LeadCapture.displayName = "LeadCapture";
export default LeadCapture;
