import { Flex, Text, VStack } from "@chakra-ui/react";

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
        <Text>{process.env.NEXT_PUBLIC_NAME}.com</Text>
        <Text>2025</Text>
      </VStack>
    </Flex>
  );
};

export default Footer;
