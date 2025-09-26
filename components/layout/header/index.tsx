import {
  Box,
  Flex,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import Logo from "./Logo";

import SwipeableDrawer from "./drawer";
import Nav from "../nav";
import NavHeading from "../nav/NavHeading";
import CitySelector from "./city";

const Header = () => {
  const [bg100, bg900] = useToken("colors", [
    "blackAlpha.300",
    "blackAlpha.400",
  ]);
  const shadowColor = useColorModeValue(bg100, bg900);

  return (
    <Flex
      h="56px" // строго
      position="sticky"
      top="0"
      bgColor={shadowColor}
      p={[2, 4]}
      zIndex="modal"
      justifyContent="center"
      boxShadow="lg"
    >
      <Nav />
      <HStack w={{ base: "100%", md: "888px" }} justifyContent="space-between">
        <Logo />
        <SwipeableDrawer />

        {/* <CitySelector /> */}
        <Box display={{ base: "none", xl: "block" }}>
          <NavHeading />
        </Box>
      </HStack>
    </Flex>
  );
};

export default Header;
