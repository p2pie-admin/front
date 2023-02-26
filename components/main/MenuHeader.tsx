import { Box, Button, Center, Grid, HStack, Text } from "@chakra-ui/react";
import { FiShare, FiSettings } from "react-icons/fi";

const MenuHeader = () => {
  return (
    <HStack mb="4" w="100%" justifyContent="space-between" h="8">
      <Button
        p="1"
        m="0"
        borderRadius="2xl"
        bgColor="bg.900"
        variant="default"
        color="bg.200"
      >
        <FiSettings />
      </Button>
      <Center>
        <Text fontSize="xl" fontWeight="bold" color="bg.100">
          Exchange
        </Text>
      </Center>
      <Button
        p="1"
        m="0"
        borderRadius="2xl"
        bgColor="bg.900"
        variant="default"
        color="bg.200"
      >
        <FiShare />
      </Button>
    </HStack>
  );
};

export default MenuHeader;
