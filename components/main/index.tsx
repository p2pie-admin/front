import { Box, Button, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import Greeting from "./Greeting";
import Side from "./side";
import ReverseButton from "./ReverseButton";
import SideContext from "./SideContext";
import Carousel from "../main/carousel";
import { useAppSelector } from "../../redux/hooks";
import Dirs from "./dir";

const Main = () => {
  const activeDir = useAppSelector((state) => state.main.activeDir);
  const populars = useAppSelector((state) => state.main.populars);

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

          <Carousel />

          <Box
            bgColor={useColorModeValue("gray.50", "bg.500")}
            minH="10vh"
            p={{ base: "10px 2px", md: "2", sm: "1" }}
            borderRadius="xl"
            filter={activeDir ? "brightness(0.3)" : "unset"}
            w="100%"
            mt="5"
          >
            <Dirs dirs={populars} />
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Main;
