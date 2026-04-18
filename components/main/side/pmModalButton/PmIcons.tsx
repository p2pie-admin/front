import { HStack, Box } from "@chakra-ui/react";

import CircularIcon from "../../../shared/CircularIcon";

import { IPm } from "../../../../types/selector";

const PmIcons = ({
  pms,
  size = "md",
}: {
  pms: IPm[];
  size?: "sm" | "md" | "lg";
}) => {
  return (
    <HStack position="relative">
      <HStack minW={`${pms.length * 8 + 12}px`}>
        {pms.map((pm, index) => (
          <Box
            key={pm.code + index}
            position="absolute"
            right={`${index * 10}px`}
          >
            <CircularIcon
              iconAlt={pm.en_name}
              icon={pm.icon}
              color={pm.color || "gray"}
              size={size}
            />
          </Box>
        ))}
      </HStack>
    </HStack>
  );
};

export default PmIcons;
