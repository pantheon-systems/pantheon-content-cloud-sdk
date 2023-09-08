import queryString from "query-string";
import React from "react";
import { usePantheonClient } from "../../core/pantheon-context";
import { IconHideUI } from "../Icons/IconHideUI";
import { IconInfo } from "../Icons/IconInfo";
import { IconLeftArrow } from "../Icons/IconLeftArrow";
import { IconReload } from "../Icons/IconReload";

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
  const [showReloadWarning, setShowReloadWarning] = React.useState(false);

  // TODO: Re-enable this if a general solution is found.
  // https://getpantheon.atlassian.net/browse/PCC-51
  // const [viewFormat, setViewFormat] = React.useState('desktop');

  React.useEffect(() => {
    if (typeof window !== "undefined" && typeof location !== "undefined") {
      const parsed = queryString.parse(location.search);

      if (parsed.publishingLevel?.toString().toLowerCase() === "realtime") {
        setIsHidden(false);
      }
    }
  }, []);

  // Show the preview timeout warning when apiKey is expired
  React.useEffect(() => {
    if (!timeout) return;

    setTimeout(() => {
      setShowReloadWarning(true);
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
    <div
      style={{
        fontFamily: "Roboto, sans-serif",
        zIndex: 5,
        display: isHidden ? "none" : "flex",
        position: "absolute",
        justifyContent: "space-between",
        alignItems: "center",
        columnGap: "1rem",
        overflow: "clip",
        background: "white",
        width: "100%",
        textAlign: "center",
        color: "black",
        left: "0",
        top: "0",
        padding: "18px",
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
            background: "#DDE5E7",
            color: "#212121",
            padding: "8px 12px",
            borderRadius: "4px",
          }}
          href={`https://docs.google.com/document/d/${id}/edit`}
        >
          <IconLeftArrow /> GO BACK TO DOCS
        </a>
        <button
          style={{ ...textWithIconStyle }}
          onClick={() => location.reload()}
        >
          <IconReload /> RELOAD
        </button>
        <button
          style={{ ...textWithIconStyle }}
          onClick={() => setIsHidden(true)}
        >
          <IconHideUI /> HIDE UI
        </button>
      </div>
      <div>
        {showReloadWarning ? (
          <div
            style={{
              display: "flex",
              color: "#212121",
              alignItems: "center",
              columnGap: "4px",
              flexDirection: "row",
            }}
          >
            <IconInfo />{" "}
            <span
              style={{
                color: "black",
                opacity: "50%",
              }}
            >
              Reload current live preview to continue receiving realtime
              updates.
            </span>
          </div>
        ) : null}
      </div>
      {/* TODO: Re-enable this if a general solution is found. 
       https://getpantheon.atlassian.net/browse/PCC-51 */}
      {/* <ViewFormatChooser
          viewFormat={viewFormat}
          setViewFormat={setViewFormat}
        /> */}
    </div>
  );
};
