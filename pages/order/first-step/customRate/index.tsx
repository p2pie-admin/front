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
import SideContext from "../../../../components/shared/contexts/SideContext";
import { RegularBox, ResponsiveText } from "../../../../styles/theme/custom";

import PmModalButton from "../../../../components/main/side/pmModalButton";

import P2PContext from "../../../../components/shared/contexts/p2pContext";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import Collapsed from "./collapsed";
import { triggerP2PDir } from "../../../../redux/mainReducer";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { IP2PDir } from "../../../../types/p2p";
import AddPm from "../AddPm";
import ReverseButton from "../../../../components/main/ReverseButton";
import { RiDeleteBinLine } from "react-icons/ri";

// const PmWrapper = ({ children }: { children: React.ReactChild }) => {
//   const borderColor = useColorModeValue("blackAlpha.500", "whiteAlpha.300");
//   return (
//     <Button p="2" variant="contrast">
//       <HStack>{children}</HStack>
//     </Button>
//   );
// };

const CustomRate = ({ index }: { index: number }) => {
  //const [isVisible, ratesExist] = [true, true];
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
          {ratesExist ? (
            <Button variant="contrast" size="sm" color="red.500">
              <RiDeleteBinLine size="1rem" />
            </Button>
          ) : (
            <Box minW="10"></Box>
          )}

          <SideContext.Provider value={"give"}>
            <PmModalButton />
          </SideContext.Provider>

          {/* <P2PReverseButton /> */}
          <TbArrowsExchange size="1.5rem" />

          <SideContext.Provider value={"get"}>
            <PmModalButton />
          </SideContext.Provider>

          {ratesExist && (
            <HStack ml="auto" px="2">
              {isVisible ? (
                <Button variant="contrast" size="sm">
                  <SlArrowUp size="1rem" />
                </Button>
              ) : (
                <Button variant="contrast" size="sm">
                  <SlArrowDown size="1rem" />
                </Button>
              )}
            </HStack>
          )}
        </HStack>

        <Collapsed />
      </P2PContext.Provider>
    </RegularBox>
  );
};

export default CustomRate;
