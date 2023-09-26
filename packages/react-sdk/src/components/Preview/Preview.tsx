import queryString from "query-string";
import React from "react";
import "../../index.css";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { motion } from "framer-motion";
import { getCookie } from "../../utils/cookies";
import { HoverButton } from "../Common/HoverButton";
import { IconDocs } from "../Icons/IconDocs";
import { IconUp } from "../Icons/IconUp";
import { LivePreviewIndicator } from "./LivePreviewIndicator";

interface Props {
  article: Article;
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

export const PreviewBar = ({ article, previewBarOverride, timeout }: Props) => {
  const [isHidden, setIsHidden] = React.useState(false);
  const [isLive, setIsLive] = React.useState(true);
  const [hasCopied, setHasCopied] = React.useState(false);

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
      article,
    });
  }

  return (
    <motion.div
      style={{
        fontFamily: "Poppins, sans-serif",
        fontWeight: 700,
        zIndex: 5,
        height: 58,
        position: "absolute",
        overflow: "clip",
        background: "white",
        width: "100%",
        textAlign: "center",
        color: "black",
        left: "0",
        top: "0",
        padding: 0,
        borderBottom: "1px solid #CFCFD3",
        overflowY: "hidden",
        fontSize: "16px",
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          columnGap: "1rem",
          width: "100%",
        }}
      >
        <motion.div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "1rem",
            opacity: 0,
            paddingTop: "-4px",
          }}
          animate={{ opacity: isHidden ? 0 : 1 }}
          transition={{ delay: isHidden ? 0 : 0.5 }}
        >
          <a
            style={{
              ...textWithIconStyle,
              fontFamily: "Poppins, sans-serif",
              fontWeight: 500,
              color: "#23232D",
              padding: "8px 12px",
            }}
            href={`https://docs.google.com/document/d/${article.id}/edit`}
            target="_blank"
          >
            <IconDocs /> {article.title}
          </a>
        </motion.div>
        <motion.div
          style={{
            opacity: 0,
            paddingTop: "-9px",
          }}
          animate={{ opacity: isHidden ? 0 : 1 }}
          transition={{ delay: isHidden ? 0 : 0.5 }}
        >
          <LivePreviewIndicator isLive={isLive} />
        </motion.div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            columnGap: "4px",
            alignItems: "center",
          }}
        >
          <motion.div
            style={{ opacity: 0, paddingTop: "-9px" }}
            animate={{ opacity: isHidden ? 0 : 1 }}
            transition={{ delay: isHidden ? 0 : 0.5 }}
          >
            <HoverButton
              style={{
                ...textWithIconStyle,
                background: "#FFDC28",
                padding: "8px 12px",
                borderRadius: "3px",
                gap: "10px",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "#23232D",
              }}
              onClick={() => {
                let parsedUrl = queryString.parseUrl(window.location.href, {
                  parseFragmentIdentifier: true,
                });

                const query = {
                  ...(parsedUrl.query || {}),
                  pccGrant: getCookie("PCC-GRANT"),
                }; 

                navigator.clipboard.writeText(
                  `${parsedUrl.url}?${queryString.stringify(query)}#${
                    parsedUrl.fragmentIdentifier
                  }`,
                );
                setHasCopied(true);
              }}
            >
              {hasCopied ? "Copied URL" : "Copy URL"}
            </HoverButton>
          </motion.div>
          <div
            style={
              isHidden
                ? {
                    background: "#F1F1F1",
                    padding: "16px",
                    borderRadius: "3px",
                    boxShadow: "0px 3px 8px 0px #00000026",
                    cursor: "pointer",
                  }
                : {
                    padding: "16px",
                    cursor: "pointer",
                  }
            }
            onClick={() => setIsHidden(!isHidden)}
          >
            {isHidden ? <IconUp flip={true} /> : <IconUp />}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
