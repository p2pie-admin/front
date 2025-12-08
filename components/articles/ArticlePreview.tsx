import React from "react";
import { IArticle } from "../../types/pages";
import { Box3D } from "../../styles/theme/custom";
import CustomImage from "../shared/CustomImage";
import NextLink from "next/link";
import { Box, HStack, Highlight, Link, Text } from "@chakra-ui/react";

export default function ArticlePreview({ article }: { article: IArticle }) {
  return (
    <Box3D py="1" px="4" variant="no_contrast" w="100%">
      <HStack justifyContent="space-between">
        <Box w="calc(100% - 240px)">
          <Text as="h2">{article.header}</Text>
          <Text as="h3" color="bg.300">
            {article.subheader}{" "}
            <Link
              as={NextLink}
              href={`/articles/${article.code.toLowerCase()}`}
              textDecoration="none"
            >
              <Highlight
                query={["читать далее"]}
                styles={{ color: "peach.300", textDecoration: "underline" }}
              >
                читать далее
              </Highlight>
            </Link>
          </Text>
        </Box>

        <CustomImage img={article.preview} w="200px" />
      </HStack>
    </Box3D>
  );
}
