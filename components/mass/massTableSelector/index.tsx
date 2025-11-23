import React from "react";
import { Box3D } from "../../../styles/theme/custom";
import { HStack, Text, Box, Divider } from "@chakra-ui/react";
import SideButtons from "./SideButtons";
import CryptoList from "./CryptoList";
// import FiatSelector from "./FiatSelector";

import FiatSelector from "./FiatSelector";
import { IPm } from "../../../types/selector";

export default function MassTableSelector({ cryptoPms }: { cryptoPms: IPm[] }) {
  return (
    <Box3D
      variant="no_contrast"
      w="100%"
      minH="10"
      px={["2", "4"]}
      py={["2", "4"]}
    >
      <Box mt="2" px="4" py="2">
        <CryptoList cryptoPms={cryptoPms} />
        <HStack mt="6" justifyContent="space-between">
          <SideButtons />
          <Divider mx="4" display={{ base: "block", md: "none" }} />
          <Text
            fontSize="xl"
            fontWeight="bold"
            display={{ base: "block", md: "none" }}
          >
            {"за"}
          </Text>

          <Divider mx="4" />

          <FiatSelector />
        </HStack>
      </Box>
    </Box3D>
  );
}
