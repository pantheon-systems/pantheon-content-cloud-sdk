import { useMediaQuery } from "react-responsive";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.cjs";

const fullConfig = resolveConfig(tailwindConfig);
const breakpoints = fullConfig.theme.screens;

// From https://stackoverflow.com/questions/59982018/how-do-i-get-tailwinds-active-breakpoint-in-javascript
export function useBreakpoint(breakpointKey) {
  const bool = useMediaQuery({
    query: `(min-width: ${breakpoints[breakpointKey]})`,
  });
  const capitalizedKey =
    breakpointKey[0].toUpperCase() + breakpointKey.substring(1);
  const returnValue = {
    [`is${capitalizedKey}`]: bool,
  };
  // Returned separately only to avoid Codacy false positive about unnecessary blocks.
  return returnValue;
}
