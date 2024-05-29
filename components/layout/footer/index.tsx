import { Box, Center, Flex, Text, VStack } from "@chakra-ui/react";
import { Box3D } from "../../../styles/theme/custom";

const Footer = () => {
  return (
    <Flex
      w="100%"
      justifyContent="center"
      bgGradient="linear(to-t, rgba(0,0,0,0.3), transparent 30%)"
    >
      <Box3D
        w={{ base: "100%", sm: 432, lg: 888 }}
        mt="5"
        color="bg.500"
        variant="no_contrast"
      >
        <VStack justifyContent="center" alignItems="center" minH="40">
          <Text>p2pie.com</Text>
          <Text>2024</Text>
        </VStack>
      </Box3D>
    </Flex>
  );
};

export default Footer;
