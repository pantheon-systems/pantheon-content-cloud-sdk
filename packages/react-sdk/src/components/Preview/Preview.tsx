import queryString from "query-string";
import React from "react";
import { IconCopy } from "../Icons/IconCopy";
import { IconHideUI } from "../Icons/IconHideUI";
import { IconLeftArrow } from "../Icons/IconLeftArrow";
import "../../index.css";
import { motion } from "framer-motion";
import { LivePreviewIndicator } from "./LivePreviewIndicator";

interface Props {
  id: string;
  previewBarOverride?: React.ReactElement | undefined | null;
  timeout?: number;
}

const textWithIconStyle: Partial<React.CSSProperties> = {
  display: "flex",
  color: "#212121",
  alignItems: "center",
  columnGap: "4px",
  flexDirection: "row",
};

export const PreviewBar = ({ id, previewBarOverride, timeout }: Props) => {
  const [isHidden, setIsHidden] = React.useState(true);
  const [isLive, setIsLive] = React.useState(true);

  React.useEffect(() => {
    if (typeof window !== "undefined" && typeof location !== "undefined") {
      const parsed = queryString.parse(location.search);

      if (parsed.publishingLevel?.toString().toLowerCase() === "realtime") {
        setIsHidden(false);
      }
    }
  }, []);

  // Show the preview timeout warning after `timeout`
  React.useEffect(() => {
    if (!timeout) return;

    setTimeout(() => {
      setIsLive(false);
    }, timeout);
  }, []);

  if (previewBarOverride != null) {
    return React.cloneElement(previewBarOverride, {
      isHidden,
      setIsHidden,
      id,
    });
  }

  return (
    <motion.div
      style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        zIndex: 5,
        height: 0,
        // display: isHidden ? "none" : "flex",
        position: "absolute",
        overflow: "clip",
        background: "white",
        width: "100%",
        textAlign: "center",
        color: "black",
        left: "0",
        top: "0",
        padding: "0",
        borderBottom: "1px solid #CFCFD3",
        overflowY: "hidden",
        fontSize: "16px",
      }}
      animate={{ height: isHidden ? 0 : 78, padding: isHidden ? 0 : 18 }}
      transition={{ delay: isHidden ? 0 : 0.5 }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          columnGap: "1rem",
          width: "100%",
          paddingRight: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "1rem",
          }}
        >
          <a
            style={{
              ...textWithIconStyle,
              background: "#3017A1",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "4px",
            }}
            href={`https://docs.google.com/document/d/${id}/edit`}
          >
            <IconLeftArrow /> GO BACK TO DOCS
          </a>
          <button
            style={{ ...textWithIconStyle }}
            onClick={() => setIsHidden(true)}
          >
            <IconHideUI /> HIDE UI
          </button>
        </div>
        <LivePreviewIndicator isLive={isLive} />
        <button
          style={{
            ...textWithIconStyle,
            border: "1px solid #23232D",
            padding: "8px 12px",
            borderRadius: "3px",
            gap: "10px",
          }}
          onClick={() => navigator.clipboard.writeText(window.location.href)}
        >
          <IconCopy /> Copy URL
        </button>
      </div>
    </motion.div>
  );
};
