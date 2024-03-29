import "../../index.css";
import { Article } from "@pantheon-systems/pcc-sdk-core/types";
import { AnimatePresence, motion } from "framer-motion";
import { setup, styled } from "goober";
import queryString from "query-string";
import React, { useEffect } from "react";
import { getCookie } from "../../utils/cookies";
import { HoverButton } from "../Common/HoverButton";
import { IconDocs } from "../Icons/IconDocs";
import { IconHamburger } from "../Icons/IconHamburger";
import { IconUp } from "../Icons/IconUp";
import { LivePreviewIndicator } from "./LivePreviewIndicator";

setup(React.createElement);

export interface PreviewBarExternalProps {
  previewBarOverride?: React.ReactElement | undefined | null;
  collapsedPreviewBarProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface PreviewBarInternalProps {
  article: Article;
}

const pccGrant = getCookie("PCC-GRANT");

export const PreviewBar = ({
  article,
  previewBarOverride,
  collapsedPreviewBarProps,
}: PreviewBarInternalProps & PreviewBarExternalProps) => {
  const [isHidden, setIsHidden] = React.useState(false);
  const [isLive, setIsLive] = React.useState(false);
  const [hasCopied, setHasCopied] = React.useState(false);
  const [copyResetTimeoutId, setCopyResetTimeoutId] =
    React.useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If no preview is active, then we can leave isLive as the default false.
    if (!article.previewActiveUntil) return;

    const livePreviewTimeRemaining = article.previewActiveUntil - Date.now();
    if (livePreviewTimeRemaining >= 100) {
      setIsLive(true);
      setTimeout(() => {
        setIsLive(false);
      }, livePreviewTimeRemaining);
    }
  }, [article]);

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
    <Wrapper
      isHidden={isHidden}
      {...(isHidden ? collapsedPreviewBarProps : {})}
    >
      <AnimatePresence>
        {!isHidden && (
          <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <TitleSection
              href={`https://docs.google.com/document/d/${article.id}/edit`}
              rel="noreferrer"
              target="_blank"
            >
              <IconDocs />
              <span>{article.title}</span>
            </TitleSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                columnGap: "10px",
              }}
            >
              <LivePreviewIndicatorContainer>
                <LivePreviewIndicator isLive={isLive} />
              </LivePreviewIndicatorContainer>
              <EndBlock>
                <CopyUrlButtonContainer>
                  <CopyUrlButton
                    style={{
                      borderRadius: "3px",
                      fontWeight: 700,
                      padding: "0 10px",
                      color: "#23232D",
                    }}
                    onClick={() => {
                      if (copyResetTimeoutId) {
                        clearTimeout(copyResetTimeoutId);
                        setCopyResetTimeoutId(null);
                      }

                      const parsedUrl = queryString.parseUrl(
                        window.location.href,
                        {
                          parseFragmentIdentifier: true,
                        },
                      );

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

                      // Reset the copied state after 2 seconds
                      const timeoutId = setTimeout(() => {
                        setHasCopied(false);
                      }, 2000);
                      setCopyResetTimeoutId(timeoutId);
                    }}
                  >
                    {hasCopied ? "Copied URL" : "Copy URL"}
                  </CopyUrlButton>
                </CopyUrlButtonContainer>
              </EndBlock>
            </div>
          </Container>
        )}
      </AnimatePresence>
      <ControllerContainer isHidden={isHidden}>
        {isHidden ? (
          <LivePreviewIndicatorContainer>
            <LivePreviewIndicator isLive={isLive} />
            <HoverButton onClick={() => setIsHidden((isHidden) => !isHidden)}>
              {(isHovered) =>
                isHovered ? (
                  <IconUp
                    flip={true}
                    style={{
                      marginLeft: "10px",
                    }}
                  />
                ) : (
                  <IconHamburger
                    style={{
                      marginLeft: "10px",
                    }}
                  />
                )
              }
            </HoverButton>
          </LivePreviewIndicatorContainer>
        ) : (
          <button onClick={() => setIsHidden((isHidden) => !isHidden)}>
            <IconUp />
          </button>
        )}
      </ControllerContainer>
    </Wrapper>
  );
};

const Wrapper = styled("div")<{ isHidden: boolean }>`
  font-family: Poppins, sans-serif;
  z-index: 5;
  position: absolute;
  top: 0;
  width: 100%;
  border-bottom: ${({ isHidden }) =>
    isHidden ? "1px solid transparent" : "1px solid #CFCFD3"};
  transition: all 0.2s ease-in-out;
  display: flex;
  justify-content: flex-end;
`;

const Container = styled(motion.div)`
  padding-left: 20px;
  padding-block: 8px;
  background: white;
  display: grid;
  gap: 1em;
  width: 100%;

  @media (min-width: 768px) {
    padding-block: 0;
    grid-auto-flow: column;
    grid-template-columns: 0.45fr 0.55fr;
  }
`;

const TitleSection = styled("a")`
  display: flex;
  flex-direction: row;
  column-gap: 10px;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #23232d;
  min-width: 0;

  > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > svg {
    flex-shrink: 0;
  }
`;

const LivePreviewIndicatorContainer = styled("div")`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EndBlock = styled("div")`
  display: flex;
  flex-direction: row;
  column-gap: 4px;
  align-items: center;
  justify-content: flex-end;
`;

const CopyUrlButtonContainer = styled("div")`
  height: 32px;
`;

const ControllerContainer = styled("div")<{ isHidden: boolean }>`
  cursor: pointer;
  padding: 16px;
  display: flex;
  align-items: center;
  ${({ isHidden }) =>
    isHidden
      ? `
    background: #F1F1F1;
    border-radius: 3px;
    box-shadow: 0px 3px 8px 0px #00000026;
  `
      : `
    background: #FFFFFF;
      `}

  @media (max-width: 768px) {
    padding: 8px;
    align-items: flex-start;
  }
`;

const CopyUrlButton = styled("button")`
  background-color: #ffdc28;
  height: 100%;
  font-size: 0.875rem;

  &:hover {
    opacity: 0.8;
  }
`;
