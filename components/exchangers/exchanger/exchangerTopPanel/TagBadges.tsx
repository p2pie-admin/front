import { Box, Tooltip } from "@chakra-ui/react";
import { resolveColorToken } from "../../../shared/CircularIcon";
import { IExchangerTag } from "../../../../types/exchanger";
import { useLocale } from "../../../../services/i18n";

const TagBadges = ({ tags }: { tags?: IExchangerTag[] | null }) => {
  const isEn = useLocale() === "en";
  if (!tags?.length) return null;

  return (
    <>
      {tags.map((tag) => (
        <Tooltip key={tag.id} openDelay={500} hasArrow label={(isEn && tag.en_description) || tag.description}>
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
            {((isEn && tag.en_name) || tag.name).toUpperCase()}
          </Box>
        </Tooltip>
      ))}
    </>
  );
};

export default TagBadges;
