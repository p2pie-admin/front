import {
  Box,
  Button,
  Flex,
  useColorModeValue,
  Text,
  IconButton,
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

const MainPageContent = () => {
  const populars = useAppSelector((state) => state.main.populars);

  return (
    <Box
      p="4"
      bgColor="bg.800"
      boxShadow="lg"
      mt={{ base: 4, sm: 16 }}
      borderRadius="2xl"
      w={{ base: "98%", sm: 432 }}
    >
      {/* <Greeting /> */}
      <MenuHeader />

      <Flex flexDir="column">
        <SideContext.Provider value={"give"}>
          <Side />
        </SideContext.Provider>

        <ReverseButton />

        <SideContext.Provider value={"get"}>
          <Side />
        </SideContext.Provider>

        {/* <LimitsRange /> */}

        <Carousel />

        {!!populars.length && <Popular dirs={populars} />}

        <MenuFooter />
      </Flex>
    </Box>
  );
};

export default MainPageContent;
