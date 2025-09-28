import { Box, HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import CircularIcon from "./CircularIcon";

const PmName = ({ pm, isFull = true }: { pm?: IPm; isFull?: boolean }) => {
  if (!pm) return <></>;
  return (
    <HStack gap="2">
      <CircularIcon
        iconAlt={pm.en_name}
        icon={pm.icon}
        color={pm.color || "gray"}
      />
      <Box position="relative" mt="0.5">
        <ResponsiveText>{`${capitalize(pm.en_name.slice(0, 12))} ${
          isFull ? pm.currency.code.toUpperCase() : ""
        } ${pm.subgroup_name || ""}`}</ResponsiveText>
        {/* <ResponsiveText
          position="absolute"
          fontSize="10"
          variant="no_contrast"
          right="0"
          bottom="-10px"
        >
          {pm.subgroup_name || ""}
        </ResponsiveText> */}
      </Box>
    </HStack>
  );
};

export default PmName;
