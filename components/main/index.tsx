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

        {/* <LimitsRange /> */}

        <Carousel />

        {!!populars.length && <Popular dirs={populars} />}
      </Flex>
    </Box>
  );
};

export default MainPageContent;
