import { Box, Tooltip } from "@chakra-ui/react";
import { resolveColorToken } from "../../../shared/CircularIcon";
import { IExchangerTag } from "../../../../types/exchanger";

const TagBadges = ({ tags }: { tags?: IExchangerTag[] | null }) => {
  if (!tags?.length) return null;

  return (
    <>
      {tags.map((tag) => (
        <Tooltip key={tag.id} openDelay={500} hasArrow label={tag.description}>
          <Box
            borderRadius="lg"
            py="0.5"
            px="1"
            my="1"
            borderColor={resolveColorToken(tag.color)}
            border="1px solid"
            color={resolveColorToken(tag.color)}
            fontWeight="bold"
            boxShadow="lg"
            fontSize="xs"
            cursor="pointer"
          >
            {tag.name.toUpperCase()}
          </Box>
        </Tooltip>
      ))}
    </>
  );
};

export default TagBadges;
