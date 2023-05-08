import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiShare, FiSettings } from "react-icons/fi";

const MenuHeader = () => {
  return (
    <Grid
      gridTemplateColumns="40px 1fr 40px"
      mb="4"
      gridGap="4"
      justifyContent="space-between"
      h="10"
    >
      <Button variant={useColorModeValue("white", "black")} p="1">
        <FiSettings />
      </Button>
      <HStack
        justifyContent="center"
        fontWeight="bold"
        alignItems="center"
        color="bg.500"
      >
        <Text whiteSpace="nowrap" fontSize="2xl">
          Search Exchangers
        </Text>
      </HStack>
      <Button variant={useColorModeValue("white", "black")} p="1">
        <FiShare />
      </Button>
    </Grid>
  );
};

export default MenuHeader;
