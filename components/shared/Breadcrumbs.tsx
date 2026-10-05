import { Box, HStack, Link as ChakraLink, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export type Crumb = { label: string; href?: string };

// Visible breadcrumb trail (the BreadcrumbList JSON-LD lives in UniversalSeo). Last item
// is plain text; the rest are internal links. Wraps on narrow screens.
const Breadcrumbs = ({ items, ...props }: { items: Crumb[]; [k: string]: any }) => {
  if (!items?.length) return null;
  return (
    <HStack
      as="nav"
      aria-label="Хлебные крошки"
      spacing="1"
      flexWrap="wrap"
      fontSize="xs"
      color="bg.400"
      lineHeight="1.6"
      {...props}
    >
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <HStack key={`${c.label}-${i}`} spacing="1" as="span">
            {c.href && !last ? (
              <ChakraLink as={NextLink} href={c.href} prefetch={false} color="bg.300" _hover={{ color: "peach.200" }}>
                {c.label}
              </ChakraLink>
            ) : (
              <Text as="span" color={last ? "bg.300" : "bg.400"} noOfLines={1}>
                {c.label}
              </Text>
            )}
            {!last ? <Box as="span" color="bg.500">›</Box> : null}
          </HStack>
        );
      })}
    </HStack>
  );
};

export default Breadcrumbs;
