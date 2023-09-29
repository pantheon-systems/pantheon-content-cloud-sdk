/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
import { setup, styled } from "goober";
import React, { useState } from "react";
import { Arrow, useLayer } from "react-laag";
import { IconDot } from "../Icons/IconDot";
import { IconInfo } from "../Icons/IconInfo";

interface Props {
  isLive: boolean;
}

setup(React.createElement);

export const LivePreviewIndicator = ({ isLive }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    triggerOffset: 24,
    placement: "bottom-center",
    onOutsideClick: () => setIsOpen(false),
  });

  return (
    <Container>
      <IconDot fill={isLive ? "#218C5F" : "#CFCFD3"} />
      <span>{isLive ? "Active Live Preview" : "Inactive Live Preview"}</span>
      {!isLive ? (
        <InfoButton onClick={() => setIsOpen(!isOpen)} {...triggerProps}>
          <IconInfo />
        </InfoButton>
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
                  This preview page is no longer connected to the document
                  (updates to the document will not be displayed until this is
                  reconnected).{" "}
                </span>
                <br />
                <span style={{ fontWeight: 500 }}>
                  To reconnect, navigate to the document and select the
                  &apos;Preview&apos; button in the Content Cloud add-on.
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
    </Container>
  );
};

const Container = styled("div")`
  border: 1px solid #cfcfd3;
  font-weight: 600;
  display: flex;
  align-items: center;
  border-radius: 100px;
  color: #6d6d78;
  padding: 0 8px;
  font-size: 12px;
  flex-direction: row;
  width: fit-content;
  height: 24px;

  > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left: 8px;
  }
`;

const InfoButton = styled("button", React.forwardRef)`
  margin-left: 8px;
`;
