import { HiArrowLongRight } from "react-icons/hi2";

import Wrapper from "../Wrapper";
import { HStack, useColorModeValue } from "@chakra-ui/react";
import SideContext from "../../../shared/SideContext";
import PopularSide from "./popular-side";

const Popular = () => {
  return (
    <Wrapper title="Quick Change">
      <HStack
        justifyContent="center"
        color={useColorModeValue("secondary.600", "primary.200")}
      >
        <SideContext.Provider value={"give"}>
          <PopularSide />
        </SideContext.Provider>

        <HiArrowLongRight size="1.5rem" />

        <SideContext.Provider value={"get"}>
          <PopularSide />
        </SideContext.Provider>
      </HStack>
    </Wrapper>
  );
};

export default Popular;
