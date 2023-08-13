import { HStack, Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/pmModalButton/section/PmGroup/helper";
import CircularIcon from "./CircularIcon";

const PmFullName = ({ pm }: { pm: IPm }) => {
  const color = useColorModeValue("bg.800", "bg.100");
  const name = pm.en_name;
  return (
    <HStack>
      <CircularIcon icon={pm.icon} color={pm.color} />
      <Text color={color} fontSize="md" fontWeight="bold">{`${capitalize(
        name
      )} ${pm.currency.code.toUpperCase()}`}</Text>
      {pm.subgroup_name && (
        <Tag colorScheme="bg" size="sm">
          {pm.subgroup_name}
        </Tag>
      )}
    </HStack>
  );
};

export default PmFullName;
