import { Box, Button, Flex, useColorModeValue, Text } from "@chakra-ui/react";
import Greeting from "./Greeting";
import Side from "./side";
import ReverseButton from "./ReverseButton";
import SideContext from "./SideContext";
import Carousel from "../main/carousel";
import { useAppSelector } from "../../redux/hooks";
import Dirs from "./dir";

const MainPageContent = () => {
  const populars = useAppSelector((state) => state.main.populars);

  return (
    <Box p="2">
      <Greeting />

      <Flex mt="3" maxW={{ base: "96vw", sm: "450" }} flexDir="column">
        <SideContext.Provider value={"give"}>
          <Side />
        </SideContext.Provider>

        <ReverseButton />

        <SideContext.Provider value={"get"}>
          <Side />
        </SideContext.Provider>

        <Carousel />

        {!!populars.length && <Dirs dirs={populars} />}
      </Flex>
    </Box>
  );
};

export default MainPageContent;
