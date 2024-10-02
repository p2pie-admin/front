import { HStack } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
import { IPm } from "../../types/selector";
import { capitalize } from "../main/side/selector/section/PmGroup/helper";
import CircularIcon from "./CircularIcon";

const PmName = ({ pm }: { pm?: IPm }) => {
  if (!pm) return <></>;
  return (
    <HStack gap="2" w="100%">
      <CircularIcon
        iconAlt={pm.en_name}
        icon={pm.icon}
        color={pm.color || "gray"}
      />
      <ResponsiveText>{`${capitalize(
        pm.en_name.slice(0, 12)
      )} ${pm.currency.code.toUpperCase()}`}</ResponsiveText>
    </HStack>
  );
};

export default PmName;
