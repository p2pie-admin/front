import {
  Box,
  Flex,
  Grid,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import Logo from "./Logo";
import Nav from "./nav";

const Header = () => {
  const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  const [bg200, bg900] = useToken("colors", ["bg.200", "bg.900"]);

  return (
    <Flex
      h="16" // строго
      position="sticky"
      top="0"
      bgColor={useColorModeValue("bg.200", "bg.900")}
      w="100%"
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
        justifyContent="space-between"
        alignItems="center"
        maxW={maxW}
        minW={maxW}
      >
        <Logo />
        <Nav />
      </HStack>
    </Flex>
  );
};

export default Header;
