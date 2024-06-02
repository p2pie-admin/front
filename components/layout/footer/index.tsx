import { Box, Center, Flex, Text, VStack } from "@chakra-ui/react";
import { Box3D } from "../../../styles/theme/custom";

const Footer = () => {
  return (
    <Flex
      w="100%"
      justifyContent="center"
      bgGradient="linear(to-t, rgba(0,0,0,0.3), transparent 30%)"
    >
      <VStack
        justifyContent="center"
        alignItems="center"
        minH="40"
        color="bg.500"
        fontSize="lg"
      >
        <Text>p2pie.com</Text>
        <Text>2024</Text>
      </VStack>
    </Flex>
  );
};

export default Footer;
