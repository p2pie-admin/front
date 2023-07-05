import { Box, HStack, Collapse, Text, VStack } from "@chakra-ui/react";
import { IoIosArrowRoundForward } from "react-icons/io";
import SideContext from "../../../components/shared/contexts/SideContext";
import { RegularBox } from "../../../styles/theme/wrappers";
import InputWithSlider from "./sliders/inputSliderGroup";
import PmModalButton from "../../../components/main/side/pmModalButton";
import { useState } from "react";
import P2PContext from "../../../components/shared/contexts/p2pContext";
import { useAppSelector } from "../../../redux/hooks";
import Sliders from "./sliders";

const PmWrapper = ({ children }: { children: React.ReactChild }) => (
  <Box
    px="2"
    border="1px solid"
    borderColor="whiteAlpha.300"
    borderRadius="2xl"
  >
    {children}
  </Box>
);

const SuggestedRate = () => {
  return (
    <>
      <HStack mt="4" spacing="4">
        <P2PContext.Provider value={true}>
          <PmWrapper>
            <SideContext.Provider value={"give"}>
              <PmModalButton />
            </SideContext.Provider>
          </PmWrapper>
          <IoIosArrowRoundForward size="2rem" />
          <PmWrapper>
            <SideContext.Provider value={"get"}>
              <PmModalButton />
            </SideContext.Provider>
          </PmWrapper>
        </P2PContext.Provider>
      </HStack>

      <Sliders />
    </>
  );
};

export default SuggestedRate;
