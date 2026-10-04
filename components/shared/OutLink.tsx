import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

// A link to another site that is NOT an <a> in the HTML: the address lives in a prop and the browser opens it
// on click. Crawlers see plain text, so such references never count as outbound links of our pages.
type Props = BoxProps & { href: string; label?: string };

const open = (href: string) => {
  if (typeof window !== "undefined") window.open(href, "_blank", "noopener,noreferrer");
};

const OutLink = ({ href, label, children, ...rest }: Props) => (
  <Box
    as="span"
    role="link"
    tabIndex={0}
    cursor="pointer"
    title={label}
    onClick={(e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      open(href);
    }}
    onKeyDown={(e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open(href);
      }
    }}
    {...rest}
  >
    {children}
  </Box>
);

export default OutLink;
