import React from "react";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import {
  HStack,
  Text,
  Button,
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
  slug,

  cryptoPms,
}: {
  slug: string;

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
          <CryptoList slug={slug} cryptoPms={cryptoPms} />
          <HStack mt="6" justifyContent="space-between">
            <SideButtons slug={slug} />
            <Divider />
            <Text fontSize="xl" fontWeight="bold">
              {"за"}
            </Text>
            <Divider />
            <FiatSelector slug={slug} />
          </HStack>
        </Box>
      ) : (
        <HStack>
          <SideButtons slug={slug} />
          <CryptoList slug={slug} cryptoPms={cryptoPms} />
          <FiatSelector slug={slug} />
        </HStack>
      )}
    </Box3D>
  );
}
