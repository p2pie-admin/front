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
import { transparentize } from "@chakra-ui/theme-tools";

const Header = () => {
  const [bg100, bg1000] = useToken("colors", ["bg.100", "bg.1000"]);
  const bgColor = useColorModeValue(
    transparentize(bg100, 0.95), // 0.2 → 20% more transparent
    transparentize(bg1000, 0.95)
  );

  return (
    <Flex
      h="56px" // строго
      position="sticky"
      top="0"
      bgColor={bgColor as any}
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
