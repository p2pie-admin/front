import { Box3D } from "../../../../styles/theme/wrappers";
import { Box, Center, Flex, Grid, HStack, Text } from "@chakra-ui/react";
import { IoAddSharp } from "react-icons/io5";
import { HiArrowLongRight } from "react-icons/hi2";
import QuickSide from "./QuickSide";

const QuickChange = () => {
  return (
    <Box3D w="100%" bgColor="bg.900">
      <Flex justifyContent="center" alignItems="end">
        <Text fontSize="sm" color="bg.400">
          Quick Change
        </Text>
      </Flex>
      <HStack justifyContent="center" color="bg.200">
        <QuickSide />
        <HiArrowLongRight size="1.5rem" />
        <QuickSide />
      </HStack>
    </Box3D>
  );
};

export default QuickChange;
