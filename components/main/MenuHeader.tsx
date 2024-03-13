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
import { ResponsiveText } from "../../styles/theme/custom";

const MenuHeader = () => {
  return (
    <Grid
      gridTemplateColumns="40px 1fr 40px"
      mb="4"
      gridGap="4"
      justifyContent="space-between"
      h="10"
    >
      <Button variant="extra_contrast" p="1">
        <FiSettings />
      </Button>
      <HStack justifyContent="center" alignItems="center">
        <ResponsiveText variant="no_contrast" whiteSpace="nowrap" size="lg">
          {`Search Exchangers and P2P`}
        </ResponsiveText>
      </HStack>
      <Button variant="extra_contrast" p="1">
        <FiShare />
      </Button>
    </Grid>
  );
};

export default MenuHeader;
