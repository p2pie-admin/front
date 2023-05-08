import {
  Box,
  Grid,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import Shader from "../../shared/Shader";
import Logo from "./Logo";
import Nav from "./nav";

const Header = () => {
  const navGrid = useBreakpointValue({ base: "1fr", lg: "1fr 6fr 1fr" });
  const [bg300, bg900] = useToken("colors", ["bg.300", "bg.900"]);

  return (
    <Box
      position="sticky"
      top="0"
      bgColor={useColorModeValue("bg.300", "bg.900")}
      w="100%"
      p={2}
      zIndex="modal"
      h="12"
      boxShadow={`0 15px 15px -6px ${useColorModeValue(bg300, bg900)}`}
      // bgGradient={useColorModeValue(
      //   `linear(to-t, ${bg100}, rgba(0,0,0,0))`,
      //   `linear(to-t, ${bg900}, rgba(0,0,0,0))`
      // )}
    >
      <Grid templateColumns={navGrid}>
        {/*  отступы */}
        <Box></Box>
        <Box
          display="flex"
          flexDir="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Logo />
          <Nav />
        </Box>
        <Box></Box>
      </Grid>
    </Box>
  );
};

export default Header;
