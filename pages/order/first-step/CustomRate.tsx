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
import { TbArrowsExchange } from "react-icons/tb";
import SideContext from "../../../components/shared/contexts/SideContext";
import { RegularBox, ShadedButton } from "../../../styles/theme/wrappers";

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
  const borderColor = useColorModeValue("blackAlpha.500", "whiteAlpha.300");
  return (
    <ShadedButton px="2" border="2px solid" borderColor="bg.500">
      <HStack>{children}</HStack>
    </ShadedButton>
  );
};

const CustomRate = ({ index }: { index: number }) => {
  const [isVisible, ratesExist] = useAppSelector((state) => [
    state.main.p2p.dirs[index].isVisible,
    !!state.main.p2p.dirs[index].currencyConverterRate?.rate,
  ]);

  const dispatch = useAppDispatch();

  return (
    <RegularBox key={index} p="2" my="2" variant="contrast">
      <P2PContext.Provider value={index}>
        <HStack
          spacing="4"
          cursor="pointer"
          color="bg.300"
          onClick={() => ratesExist && dispatch(triggerP2PDir(index))}
        >
          <PmWrapper>
            <SideContext.Provider value={"give"}>
              <AddPm />
              <PmModalButton />
            </SideContext.Provider>
          </PmWrapper>
          {/* <P2PReverseButton /> */}
          <TbArrowsExchange size="1.5rem" />

          <PmWrapper>
            <SideContext.Provider value={"get"}>
              <AddPm />
              <PmModalButton />
            </SideContext.Provider>
          </PmWrapper>

          {ratesExist && (
            <Box ml="auto" px="2">
              {isVisible ? (
                <SlArrowUp size="1rem" />
              ) : (
                <SlArrowDown size="1rem" />
              )}
            </Box>
          )}
        </HStack>

        <Sliders />
      </P2PContext.Provider>
    </RegularBox>
  );
};

export default CustomRate;
