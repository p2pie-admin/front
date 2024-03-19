import {
  useColorModeValue,
  Grid,
  Box,
  Divider,
  Text,
  Flex,
  HStack,
} from "@chakra-ui/react";
import { Box3D } from "../../../styles/theme/custom";
import { IPm } from "../../../types/selector";
import AmountInput from "./amountInput";
import PmModalButton from "./pmModalButton";

const Side = () => {
  return (
    <Box3D>
      <HStack
        gap="4"
        py="0"
        px="4"
        w="100%"
        h="20"
        justifyContent="space-between"
      >
        <PmModalButton />

        <AmountInput />
      </HStack>
    </Box3D>
  );
};

export default Side;
