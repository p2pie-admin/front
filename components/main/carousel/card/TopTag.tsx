import {
  TagLabel,
  TagRightIcon,
  Tag,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";

import { BiCheckCircle } from "react-icons/bi";
import { ITop } from "../../../../types/rates";
import capsFirst from "../utils/capsFirst";
import icons from "./icons";

const TopTag = ({ top }: { top: ITop }) => {
  const IconComponent = icons[top.code] || BiCheckCircle;
  const size = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Tooltip hasArrow label={top.en_description} bg="bg.200" openDelay={500}>
      <Tag
        cursor="initial"
        size={size}
        variant="outline"
        colorScheme={`${top.color}`}
        minW="auto"
        whiteSpace="nowrap"
      >
        <TagLabel>{capsFirst(top.title)}</TagLabel>
        <TagRightIcon>{<IconComponent size="1.5rem" />}</TagRightIcon>
      </Tag>
    </Tooltip>
  );
};

export default TopTag;
