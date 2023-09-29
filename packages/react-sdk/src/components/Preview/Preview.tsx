/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import queryString from "query-string";
import React, { useEffect } from "react";
import "../../index.css";
import { parseJwt } from "@pantheon-systems/pcc-sdk-core";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { motion } from "framer-motion";
import { getCookie } from "../../utils/cookies";
import { HoverButton } from "../Common/HoverButton";
import { IconDocs } from "../Icons/IconDocs";
import { IconUp } from "../Icons/IconUp";
import { LivePreviewIndicator } from "./LivePreviewIndicator";

// Default timeout for live preview: 10 minutes
const LIVE_PREVIEW_TIMEOUT_MS = 1000 * 60 * 5;

interface Props {
  article: Article;
  previewBarOverride?: React.ReactElement | undefined | null;
}

const textWithIconStyle: Partial<React.CSSProperties> = {
  display: "flex",
  color: "#212121",
  alignItems: "center",
  columnGap: "4px",
  flexDirection: "row",
};

const pccGrant = getCookie("PCC-GRANT");

function calculateTimePassed(iat: number) {
  return Date.now() - iat * 1000;
}

export const PreviewBar = ({ article, previewBarOverride }: Props) => {
  const [isHidden, setIsHidden] = React.useState(false);
  const [isLive, setIsLive] = React.useState(false);
  const [hasCopied, setHasCopied] = React.useState(false);

  useEffect(() => {
    try {
      // If there's no grant, then we can leave isLive as the default false.
      if (!pccGrant) return;
      const { iat } = parseJwt(pccGrant);
      const livePreviewTimeRemaining =
        LIVE_PREVIEW_TIMEOUT_MS - calculateTimePassed(iat);

      if (livePreviewTimeRemaining >= 100) {
        setIsLive(true);
        setTimeout(() => {
          setIsLive(false);
        }, livePreviewTimeRemaining);
      }
    } catch {
      // Pass
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== "undefined" && typeof location !== "undefined") {
      const parsed = queryString.parse(location.search);

      if (parsed.publishingLevel?.toString().toLowerCase() === "realtime") {
        setIsHidden(false);
      }
    }
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
        background: isHidden ? "transparent" : "white",
        width: "100%",
        textAlign: "center",
        color: "black",
        left: "0",
        top: "0",
        padding: 0,
        borderBottom: isHidden ? undefined : "1px solid #CFCFD3",
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
            rel="noreferrer"
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
                const parsedUrl = queryString.parseUrl(window.location.href, {
                  parseFragmentIdentifier: true,
                });

                const query = {
                  ...(parsedUrl.query || {}),
                  pccGrant,
                };

                navigator.clipboard.writeText(
                  `${parsedUrl.url}?${queryString.stringify(query)}${
                    parsedUrl.fragmentIdentifier
                      ? `#${parsedUrl.fragmentIdentifier}`
                      : ""
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
