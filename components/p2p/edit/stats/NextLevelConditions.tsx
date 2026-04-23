import { VStack, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Box3D } from "../../../../styles/theme/custom";
import MyTooltip from "../../../shared/MyTooltip";

export default function NextLevelConditions({
  conditions,
}: {
  conditions: {
    is_completed: boolean;
    id?: string | null | undefined;
    title?: string | null | undefined;
    description?: string | null | undefined;
  }[];
}) {
  return (
    <VStack w="100%" mt="2" spacing="1" alignItems="start">
      <Text fontSize="sm" mb="2" ml="2" color="bg.400">
        Для перехода на следующий уровень необходимо:
      </Text>
      {conditions.map((c, index) => (
        <Box3D
          cursor="pointer"
          key={c.id || c.description || `condition-${index}`}
          py="1"
          px="2"
          w="100%"
          variant={c.is_completed ? "contrast" : "extra_contrast"}
          color={c.is_completed ? "green.300" : "red.300"}
        >
          <MyTooltip label={c.description || ""}>
            <HStack
              w="100%"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing="3"
            >
              <Text
                fontSize="sm"
                color={c.is_completed ? "bg.400" : "bg.200"}
                pr="2"
              >
                {`${index + 1}) ${c.title}`}
              </Text>
              {c.is_completed ? (
                <FaCheck size="1rem" />
              ) : (
                <FaXmark size="1rem" />
              )}
            </HStack>
          </MyTooltip>
        </Box3D>
      ))}
    </VStack>
  );
}
