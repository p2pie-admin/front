import React from "react";
import { IArticle } from "../../types/pages";
import { Box3D } from "../../styles/theme/custom";
import CustomImage from "../shared/CustomImage";
import NextLink from "next/link";
import {
  Box,
  HStack,
  Highlight,
  Link,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useT } from "../../services/i18n";

export default function ArticlePreview({ article }: { article: IArticle }) {
  const t = useT();
  const readMore = t("читать далее", "read more (in Russian)");
  const ambientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(247, 197, 177, 0.15)"
  );
  return (
    <Box3D
      py="1"
      px="4"
      variant="no_contrast"
      w="100%"
      cursor="pointer"
      filter="brightness(1)"
      _hover={{ filter: "brightness(1.05)" }}
    >
      <Link
        as={NextLink}
        href={`/articles/${article.code.toLowerCase()}`}
        textDecoration="none"
      >
        <HStack position="relative" justifyContent="center">
          <CustomImage img={article.preview} w="200px" />
          <Box
            position="absolute"
            inset={0}
            h="250px"
            w="100%"
            top="-20px"
            zIndex={0}
            pointerEvents="none" // <-- lets all clicks/touches pass through
            bgGradient={`radial-gradient(ellipse at 50% 50%, ${ambientColor} 10%, transparent 55%)`}
          />
        </HStack>
        <Box>
          <Text as="h2" fontSize="lg">
            {article.header}
          </Text>
          <Text as="h3" fontSize="md" color="bg.300">
            {article.subheader}{" "}
            <Highlight
              query={[readMore]}
              styles={{ color: "peach.300", textDecoration: "underline" }}
            >
              {readMore}
            </Highlight>
          </Text>
        </Box>
      </Link>
    </Box3D>
  );
}
