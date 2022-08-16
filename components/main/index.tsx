import { Box, Button, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import Greeting from "./Greeting";
import Side from "./side";
import ReverseButton from "./ReverseButton";
import SideContext from "./SideContext";
import PopularDirs from "./popular";
import Carousel from "../main/carousel";
import { useAppSelector } from "../../redux/hooks";

const Main = () => {
  const dirTopsExist = useAppSelector(
    (state) => !!state.main.dirTops?.uniqueRates
  );

  return (
    <>
      <Greeting />
      <Box
        p="2px"
        bgGradient={useColorModeValue(
          "linear(to-b, bg.50, white)",
          "linear(to-bl, bg.600, bg.800)"
        )}
        borderRadius={{ base: "0", sm: "xl" }}
      >
        <Flex
          p={{ base: "5", sm: "5" }}
          boxShadow={{ base: "0", sm: "xl" }}
          borderRadius={{ base: "0", sm: "xl" }}
          minH={60}
          maxW={{ base: "100%", sm: "450" }}
          bgColor={{
            base: "transparent",
            sm: useColorModeValue("bg.100", "bg.700"),
          }}
          flexDir="column"
        >
          <SideContext.Provider value={"give"}>
            <Side />
          </SideContext.Provider>

          <ReverseButton />

          <SideContext.Provider value={"get"}>
            <Side />
          </SideContext.Provider>

          {dirTopsExist ? <Carousel /> : <PopularDirs />}
        </Flex>
      </Box>
    </>
  );
};

export default Main;
