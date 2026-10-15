import { Box, HStack, Tooltip, useToken } from "@chakra-ui/react";
import React from "react";
import { IMaker, IMakerTag } from "../../../../types/p2p";
import { resolveColorToken } from "../../../shared/CircularIcon";
import { localized } from "../../i18n";
import { useLocale } from "../../../../services/i18n";

export default function MakerTags({ tags }: { tags?: IMakerTag[] | null }) {
  const locale = useLocale();
  if (!tags || !tags.length) return <></>;
  const colorTokens = tags.map((tag) => resolveColorToken(tag.color));
  const colorHexes = useToken("colors", colorTokens);
  return (
    <HStack mr="auto">
      {tags.map((tag, index) => {
        const color = colorTokens[index];
        const colorHex = colorHexes[index];
        const tagBg =
          colorHex && colorHex.startsWith("#") && colorHex.length >= 7
            ? `rgba(${parseInt(colorHex.slice(1, 3), 16)}, ${parseInt(
                colorHex.slice(3, 5),
                16,
              )}, ${parseInt(colorHex.slice(5, 7), 16)}, 0.2)`
            : "rgba(0,0,0,0.1)";
        return (
          <Tooltip
            key={tag.id}
            openDelay={500}
            hasArrow
            label={localized(tag, "description", locale)}
          >
            <Box
              borderRadius="md"
              py="0.5"
              px="1"
              my="1"
              bg={tagBg}
              color={color}
              boxShadow="lg"
              fontSize="xs"
              cursor="pointer"
              fontFamily="Montserrat, sans-serif"
              fontWeight="bold"
            >
              {localized(tag, "name", locale).toUpperCase()}
            </Box>
          </Tooltip>
        );
      })}
    </HStack>
  );
}
