import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  Text,
  IconButton,
  Grid,
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
import FancyIcon from "../shared/FancyIcon";
import MenuHeader from "./MenuHeader";
import MenuFooter from "./MenuFooter";

import { noiseURL } from "../../styles/theme/noise";

const MainPageContent = () => {
  return (
    <Box
      p="4"
      bgColor="bg.800"
      boxShadow="lg"
      mt={{ base: 4, md: 16 }}
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
      <Popular />

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
