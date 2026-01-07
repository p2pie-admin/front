import { Box, HStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { ResponsiveText } from "../../styles/theme/custom";

export default function ContentPreview({
  refChapters,
}: {
  refChapters: {
    ref: React.RefObject<HTMLDivElement>;
    title: string;
    text: string;
  }[];
}) {
  const [highlited, setHighlited] =
    useState<React.RefObject<HTMLElement> | null>(null);
  const executeScroll = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlited(ref);
  };

  return (
    <Box
      position="absolute"
      top="8"
      left="0"
      right="0"
      display="flex"
      justifyContent="flex-end"
    >
      <Box
        position="relative"
        pl="5"
        pr="3"
        py="3"
        bg="bg.800"
        border="1px solid"
        borderColor="bg.700"
        borderRadius="md"
        boxShadow="md"
        _before={{
          content: '""',
          position: "absolute",
          left: "10px",
          top: "10px",
          bottom: "10px",
          width: "1px",
          bg: "bg.600",
          borderRadius: "full",
        }}
      >
        {refChapters.map((chapter, idx) => {
          const isActive = chapter.ref === highlited;
          return (
            <HStack
              key={"chapterHeader:" + idx}
              cursor="pointer"
              align="center"
              spacing="3"
              py="2"
              onClick={() => executeScroll(chapter.ref)}
            >
              <Box
                w="6px"
                h="6px"
                borderRadius="full"
                bg={isActive ? "peach.300" : "bg.500"}
                flex="0 0 auto"
              />
              <ResponsiveText
                fontWeight="bold"
                size="md"
                color={isActive ? "peach.300" : "peach.200"}
                _hover={{
                  color: "peach.50",
                }}
                whiteSpace="normal"
              >
                {chapter.title}
              </ResponsiveText>
            </HStack>
          );
        })}
      </Box>
    </Box>
  );
}
