import { Box, HStack, VStack } from "@chakra-ui/react";
import React from "react";
import { IPmData, IPmLayout } from "../../../types/exchange";
import { RiInformationLine } from "react-icons/ri";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import PmName from "../../shared/PmName";
import { LinkWrapper } from "./LinkWrapper";

export default function pmLayout({ pmData }: { pmData: IPmData }) {
  return (
    <Box3D
      w="100%"
      variant="extra_contrast"
      p="2"
      //cursor={giveArticleExists ? "pointer" : "unset"}
      transition="filter 0.2s ease-in"
      _hover={{ filter: "brightness(1.1)" }}
    >
      <LinkWrapper
        url={`/articles/${pmData.pm.en_name.toLowerCase()}`}
        articleExists={pmData.articleExists}
      >
        <VStack h="100%" justifyContent="space-around" color="bg.400">
          <HStack justifyContent="space-between" w="100%">
            <PmName pm={pmData.pm} />

            <RiInformationLine size="1.5rem" />
          </HStack>
          <Box w="100%">
            {pmData.pmLayout?.description.split("\n").map((text, index) => (
              <ResponsiveText
                size="sm"
                key={"give" + index}
                w="100%"
                variant="no_contrast"
                whiteSpace="nowrap"
              >
                {`${text.replace("\x03", "")}`}
              </ResponsiveText>
            ))}
          </Box>
        </VStack>
      </LinkWrapper>
    </Box3D>
  );
}
