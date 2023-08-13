import {
  Box,
  HStack,
  Collapse,
  Text,
  VStack,
  useColorModeValue,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { IoIosArrowRoundForward } from "react-icons/io";
import SideContext from "../../../components/shared/contexts/SideContext";
import { RegularBox } from "../../../styles/theme/wrappers";
import InputWithSlider from "./sliders/InputSliderGroup";
import PmModalButton from "../../../components/main/side/pmModalButton";

import P2PContext from "../../../components/shared/contexts/p2pContext";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import Sliders from "./sliders";
import { triggerP2PDir } from "../../../redux/mainReducer";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { IP2PDir } from "../../../types/p2p";
import AddPm from "./AddPm";
import ReverseButton from "../../../components/main/ReverseButton";
import P2PReverseButton from "./P2PReverseButton";

const PmWrapper = ({ children }: { children: React.ReactChild }) => {
  const borderColor = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
  return (
    <HStack
      px="2"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
    >
      {children}
    </HStack>
  );
};

const CustomRate = ({ index }: { index: number }) => {
  const [isVisible, ratesExist] = useAppSelector((state) => [
    state.main.p2p.dirs[index].isVisible,
    !!state.main.p2p.dirs[index].currencyConverterRate?.rate,
  ]);
  const dispatch = useAppDispatch();
  return (
    <RegularBox key={index} p="2" my="4" variant="extra_contrast">
      <P2PContext.Provider value={index}>
        <HStack
          spacing="4"
          cursor="pointer"
          onClick={() => ratesExist && dispatch(triggerP2PDir(index))}
        >
          <PmWrapper>
            <SideContext.Provider value={"give"}>
              <AddPm />
              <PmModalButton />
            </SideContext.Provider>
          </PmWrapper>
          <P2PReverseButton />
          {/* <IoIosArrowRoundForward size="2rem" /> */}
          <PmWrapper>
            <SideContext.Provider value={"get"}>
              <AddPm />
              <PmModalButton />
            </SideContext.Provider>
          </PmWrapper>

          {ratesExist && (
            <RegularBox ml="auto" px="2">
              {isVisible ? (
                <SlArrowUp size="1rem" />
              ) : (
                <SlArrowDown size="1rem" />
              )}
            </RegularBox>
          )}
        </HStack>

        <Sliders />
      </P2PContext.Provider>
    </RegularBox>
  );
};

export default CustomRate;
