import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  Text,
  IconButton,
  Grid,
  HStack,
} from "@chakra-ui/react";
import Greeting from "./Greeting";
import Side from "./side";
import ReverseButton from "./ReverseButton";
import SideContext from "./SideContext";
import Carousel from "../main/carousel";
import { useAppSelector } from "../../redux/hooks";
import Popular from "./popular";
import { MdPhone } from "react-icons/md";
import LimitsRange from "./limits";
import CircularIcon from "../shared/CircularIcon";
import MenuHeader from "./MenuHeader";

import { tagIcons } from "./carousel/card/icons";

import { noiseURL } from "../../styles/theme/noise";
import MenuFooter from "./menu-footer";

const MainPageContent = () => {
  return (
    <Box
      p="4"
      bgColor="bg.800"
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
