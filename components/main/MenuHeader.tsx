import { Box, Button, Center, Grid, HStack, Text } from "@chakra-ui/react";
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
      <Button variant="dark" p="1">
        <FiSettings />
      </Button>
      <HStack justifyContent="center" fontWeight="bold" alignItems="center">
        <Text whiteSpace="nowrap" color={"bg.100"} fontSize="xl">
          Search Exchangers
        </Text>
        <Text mx="1" color="bg.400" fontSize="xl">
          [456]
        </Text>
      </HStack>
      <Button variant="dark" p="1">
        <FiShare />
      </Button>
    </Grid>
  );
};

export default MenuHeader;
