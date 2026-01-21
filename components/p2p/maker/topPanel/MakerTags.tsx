import { Box, Tooltip } from "@chakra-ui/react";
import React from "react";
import { IMaker, IMakerTag } from "../../../../types/p2p";
import { resolveColorToken } from "../../../shared/CircularIcon";

export default function MakerTags({ tags }: { tags?: IMakerTag[] | null }) {
  if (!tags || !tags.length) return <></>;
  return (
    <Box mr="auto">
      {tags.map((tag) => (
        <Tooltip key={tag.id} openDelay={500} hasArrow label={tag.description}>
          <Box
            borderRadius="md"
            py="0.5"
            px="1"
            my="1"
            bgColor={resolveColorToken(tag.color)}
            color={"bg.800"}
            boxShadow="lg"
            fontSize="xs"
            cursor="pointer"
          >
            {tag.name && tag.name.toUpperCase()}
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
}
