import React from "react";
import { Box3D } from "../../../styles/theme/custom";
import {
  HStack,
  Text,
  useBreakpointValue,
  Box,
  Divider,
} from "@chakra-ui/react";
import SideButtons from "./SideButtons";
import CryptoList from "./CryptoList";
// import FiatSelector from "./FiatSelector";

import FiatSelector from "./FiatSelector";
import { IPm } from "../../../types/selector";

export default function MassTableSelector({
  cryptoPms,
}: {
  cryptoPms: IPm[];
}) {
  const isSmall = useBreakpointValue({
    base: true,
    md: false,
  });
  return (
    <Box3D
      variant="no_contrast"
      w="100%"
      minH="10"
      px={["2", "4"]}
      py={["2", "4"]}
    >
      {isSmall ? (
        <Box mt="2" px="4" py="2">
          <CryptoList cryptoPms={cryptoPms} />
          <HStack mt="6" justifyContent="space-between">
            <SideButtons />
            <Divider />
            <Text fontSize="xl" fontWeight="bold">
              {"за"}
            </Text>
            <Divider />
            <FiatSelector />
          </HStack>
        </Box>
      ) : (
        <HStack>
          <SideButtons />
          <CryptoList cryptoPms={cryptoPms} />
          <FiatSelector />
        </HStack>
      )}
    </Box3D>
  );
}
