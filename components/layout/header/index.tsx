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
import Nav from "./nav";

const Header = () => {
  const [bg200, bg900] = useToken("colors", ["bg.200", "bg.900"]);

  return (
    <Flex
      h="14" // строго
      position="sticky"
      top="0"
      bgColor={useColorModeValue("bg.200", "bg.900")}
      p={[2, 4]}
      zIndex="modal"
      justifyContent="center"
      boxShadow={`0 11px 11px -6px ${useColorModeValue(bg200, bg900)}`}
      // bgGradient={useColorModeValue(
      //   `linear(to-t, ${bg100}, rgba(0,0,0,0))`,
      //   `linear(to-t, ${bg900}, rgba(0,0,0,0))`
      // )}
    >
      <HStack
        w={{ base: "100%", md: "888px" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Logo />
        <Nav />
      </HStack>
    </Flex>
  );
};

export default Header;
