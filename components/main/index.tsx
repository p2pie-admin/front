import { Box, useColorModeValue } from "@chakra-ui/react";
import Side from "./side";
import ReverseButton from "./ReverseButton";
import SideContext from "../shared/SideContext";
import Carousel from "../main/carousel";
import LimitsRange from "./limits";
import MenuHeader from "./MenuHeader";

import MenuFooter from "./menu-footer";
import { useEffect } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { decrementSwiper, incrementSwiper } from "../../redux/mainReducer";

const MainPageContent = () => {
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, true);
  }, []);

  const dispatch = useAppDispatch();

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 37) dispatch(decrementSwiper());
    if (e.keyCode === 39) dispatch(incrementSwiper());
    document.removeEventListener("keydown", handleKeyDown);
  };

  return (
    <Box
      p="4"
      bgColor={useColorModeValue("bg.100", "bg.800")}
      boxShadow="lg"
      mt="4"
      borderRadius="2xl"
      w={{ base: "98%", sm: 432 }}
    >
      <MenuHeader />
      <Box mb="4">
        <SideContext.Provider value={"give"}>
          <Side />
        </SideContext.Provider>

        <ReverseButton />

        <SideContext.Provider value={"get"}>
          <Side />
        </SideContext.Provider>
      </Box>
      <LimitsRange />
      <Carousel />

      <MenuFooter />
      {/* <Popular /> */}
      {/* {Object.entries(tagIcons).map(([name, Icon]) => (
        <HStack w="100%">
          <Box>
            {name} <Icon />
          </Box>
        </HStack>
      ))} */}
      {/* <MenuFooter /> */}
      {/* <LowerPanel /> */}
      {/* <Greeting /> */}

      {/* <Flex flexDir="column">

    
      {/* 
        <Carousel />

        <LowerPanel />

        <MenuFooter />
      </Flex> */}
    </Box>
  );
};

export default MainPageContent;
