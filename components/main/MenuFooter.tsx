import { Box, Button, Center, Grid, HStack, Text } from "@chakra-ui/react";
import { FiShare, FiSettings } from "react-icons/fi";

const Menufooter = () => {
  return (
    <HStack mt="4" w="100%" justifyContent="space-between" h="8">
      <Button
        w="100%"
        m="0"
        borderRadius="2xl"
        bgColor="bg.900"
        variant="default"
        color="bg.200"
      ></Button>
    </HStack>
  );
};

export default Menufooter;
