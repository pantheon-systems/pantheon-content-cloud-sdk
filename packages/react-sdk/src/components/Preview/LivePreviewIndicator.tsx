import { useState } from "react";
import { Arrow, useLayer } from "react-laag";
import { IconDot } from "../Icons/IconDot";
import { IconInfo } from "../Icons/IconInfo";

interface Props {
  isLive: boolean;
}

export const LivePreviewIndicator = ({ isLive }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    triggerOffset: 24,
    placement: "bottom-center",
    onOutsideClick: () => setIsOpen(false),
  });

  return (
    <div
      style={{
        border: "1px solid #CFCFD3",
        fontWeight: "600",
        alignItems: "center",
        borderRadius: "100px",
        color: "#6D6D78",
        padding: "4px 8px",
        display: "flex",
        fontSize: "12px",
        flexDirection: "row",
      }}
    >
      <IconDot fill={isLive ? "#218C5F" : "#CFCFD3"} />
      <span style={{ padding: "0 4px" }}>
        {isLive ? "Active Live Preview" : "Inactive Live Preview"}
      </span>
      {!isLive ? (
        <div
          onClick={() => setIsOpen(!isOpen)}
          {...triggerProps}
          style={{ cursor: "pointer" }}
        >
          <IconInfo />
        </div>
      ) : null}
      {isOpen
        ? renderLayer(
            <div
              {...layerProps}
              style={{
                ...layerProps.style,
                zIndex: 10,
                fontSize: "13px",
                fontWeight: 400,
                fontFamily: "Roboto, sans-serif",
              }}
            >
              <div
                style={{
                  background: "#283139",
                  color: "#fff",
                  width: "320px",
                  borderRadius: "4px",
                  padding: "8px 16px",
                }}
              >
                <span>
                  This preview page is no longer connect to the document
                  (updates to the document will not be displayed until this is
                  reconnected).{" "}
                </span>
                <br />
                <span style={{ fontWeight: 500 }}>
                  To reconnect, navigate to the document and select the
                  'Preview' button in the Content Cloud add-on.
                </span>
              </div>
              <Arrow
                {...arrowProps}
                size={16}
                roundness={0}
                backgroundColor="#283139"
              />
            </div>,
          )
        : null}
    </div>
  );
};
