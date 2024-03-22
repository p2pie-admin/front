import {
  Box,
  Button,
  useColorMode,
  Text,
  Flex,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import NavButton from "./NavButton";

import Location from "./location";
import MultipleCitiesContext from "./location/MultipleCitiesContext";

import NavMenu from "./drawer";

const Nav = () => {
  return (
    <HStack spacing="2">
      <MultipleCitiesContext.Provider value={false}>
        <Location />
      </MultipleCitiesContext.Provider>
      <NavMenu />
    </HStack>
  );
};

export default Nav;
