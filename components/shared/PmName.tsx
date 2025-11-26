import { Box, HStack, useColorModeValue, VStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import CircularIcon from "./CircularIcon";

const PmName = ({
  pm,
  isFull = true,
  isTwoLines = false,
  isHighlited = false,
}: {
  pm?: IPm;
  isFull?: boolean;
  isTwoLines?: boolean;
  isHighlited?: boolean;
}) => {
  if (!pm) return <></>;
  const nameSameAsCurrency =
    pm.code?.toUpperCase() === pm?.en_name?.toUpperCase();
  const color = isHighlited
    ? useColorModeValue("violet.600", "peach.300")
    : useColorModeValue("bg.700", "bg.200");

  const name = `${capitalize(pm.en_name.slice(0, 12))} ${
    pm.section == "crypto"
      ? pm.subgroup_name?.toUpperCase() || pm.currency.code.toUpperCase()
      : ""
  }`;
  return (
    <HStack gap="2" color={color}>
      <CircularIcon
        iconAlt={pm.en_name}
        icon={pm.icon}
        color={pm.color || "gray"}
      />

      {isTwoLines ? (
        <VStack spacing={0} align="start">
          <ResponsiveText size="sm" color={color} fontWeight="semibold">
            {pm.currency.code?.toUpperCase()}
          </ResponsiveText>
          <ResponsiveText size="xs" color={color}>
            {pm.subgroup_name ||
              (!nameSameAsCurrency && capitalize(pm.en_name))}
          </ResponsiveText>
        </VStack>
      ) : (
        <Box position="relative" mt="0.5">
          <ResponsiveText>{name}</ResponsiveText>
        </Box>
      )}
    </HStack>
  );
};

export default PmName;
