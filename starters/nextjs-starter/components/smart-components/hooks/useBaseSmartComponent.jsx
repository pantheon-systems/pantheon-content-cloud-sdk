import { useEffect } from "react";

// Should this be on the preview page itself?
export const useBaseSmartComponent = () => {
  // This useEffect is to support smart component previews.
  useEffect(() => {
    const handleResize = () => {
      if (!window?.top) return;

      window.top.postMessage(
        {
          type: "resize",
          height: document.body.scrollHeight,
          width: document.body.scrollWidth,
        },
        "*",
      );
    };

    // First mount resize.
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
};
