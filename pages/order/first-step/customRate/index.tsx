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
import { RegularBox } from "../../../../styles/theme/custom";

import PmModalButton from "../../../../components/main/side/pmModalButton";

import P2PContext from "../../../../components/shared/contexts/p2pContext";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import Collapsed from "./collapsed";
import { triggerP2PDir } from "../../../../redux/mainReducer";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";

// const PmWrapper = ({ children }: { children: React.ReactChild }) => {
//   const borderColor = useColorModeValue("blackAlpha.500", "whiteAlpha.300");
//   return (
//     <Button p="2" variant="contrast">
//       <HStack>{children}</HStack>
//     </Button>
//   );
// };

const CustomRate = ({ index }: { index: number }) => {
  const isVisible = useAppSelector(
    (state) => state.main.p2p.dirs[index].isVisible
  );
  const ratesExist = useAppSelector(
    (state) => !!state.main.p2p.dirs[index].currencyConverterRate?.rate
  );

  const dispatch = useAppDispatch();

  return (
    <RegularBox key={index} variant="contrast" mt={[3, 4]} mb={[2, 3]}>
      <P2PContext.Provider value={index}>
        <HStack
          spacing={["2", "4"]}
          cursor="pointer"
          color="bg.300"
          onClick={() => ratesExist && dispatch(triggerP2PDir(index))}
        >
          {/* {ratesExist ? (
            <Button variant="contrast" size="sm" color="red.500">
              <RiDeleteBinLine size="1rem" />
            </Button>
          ) : (
            <Box minW="10"></Box>
          )} */}

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
                <SlArrowUp size="1rem" />
              ) : (
                <SlArrowDown size="1rem" />
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
