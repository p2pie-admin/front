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
      <Button p="1" m="0" h="10" variant="dark">
        <FiSettings />
      </Button>
      <Text fontSize="2xl" fontWeight="bold" color="bg.100" textAlign="center">
        Exchangers Search
      </Text>
      <Button p="1" m="0" h="10" variant="dark">
        <FiShare />
      </Button>
    </Grid>
  );
};

export default MenuHeader;
