import {
  Box,
  Grid,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import Logo from "./Logo";
import Nav from "./nav";

const Header = () => {
  const navGrid = useBreakpointValue({ base: "1fr", lg: "1fr 6fr 1fr" });

  return (
    <Box
      position="sticky"
      top="0"
      w="100%"
      p={2}
      bgColor={useColorModeValue("bg.50", "bg.800")}
      zIndex="modal"
      boxShadow={useColorModeValue(
        "bg.50",
        "0px 10px 15px 9px rgba(38,34,45,0.56)"
      )}
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
