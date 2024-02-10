import {
  Box,
  HStack,
  Collapse,
  useColorModeValue,
  useToken,
  Button,
} from "@chakra-ui/react";
import { TbArrowsExchange } from "react-icons/tb";
import SideContext from "../../../../components/shared/contexts/SideContext";
import { RegularBox, ShadedButton } from "../../../../styles/theme/custom";

import PmModalButton from "../../../../components/main/side/pmModalButton";

import P2PContext from "../../../../components/shared/contexts/p2pContext";
import { useAppDispatch } from "../../../../redux/hooks";
import Collapsed from "./collapsed";
import { removeDir, triggerP2PDir } from "../../../../redux/mainReducer";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { RxCrossCircled } from "react-icons/rx";
import { useState } from "react";
import { RiDeleteBinFill } from "react-icons/ri";
import { IP2PDir } from "../../../../types/p2p";
// const PmWrapper = ({ children }: { children: React.ReactChild }) => {
//   const borderColor = useColorModeValue("blackAlpha.500", "whiteAlpha.300");
//   return (
//     <Button p="2" variant="contrast">
//       <HStack>{children}</HStack>
//     </Button>
//   );
// };

const CustomRate = ({ dir, index }: { dir: IP2PDir; index: number }) => {
  const dispatch = useAppDispatch();

  return (
    <Collapse in={!dir.deleted}>
      <RegularBox
        variant={"no_contrast"}
        mt={[3, 4]}
        mb={[2, 3]}
        p="2"
        boxShadow="md"
        position="relative"
      >
        <P2PContext.Provider value={index}>
          <HStack
            zIndex="1"
            borderRadius="lg"
            spacing={["2", "4"]}
            cursor="pointer"
            color="bg.300"
            onClick={() => dir.defRate && dispatch(triggerP2PDir(index))}
          >
            <SideContext.Provider value={"give"}>
              <PmModalButton />
            </SideContext.Provider>

            {/* <P2PReverseButton /> */}
            <TbArrowsExchange size="1.5rem" />

            <SideContext.Provider value={"get"}>
              <PmModalButton />
            </SideContext.Provider>

            {dir.defRate && (
              <HStack ml="auto" px="2">
                {dir.expanded ? (
                  <SlArrowUp size="1rem" />
                ) : (
                  <SlArrowDown size="1rem" />
                )}
              </HStack>
            )}
          </HStack>

          <Collapsed />
        </P2PContext.Provider>

        {dir.give && dir.get && (
          <RegularBox
            w="5"
            h="5"
            variant={"no_contrast"}
            position="absolute"
            right="0"
            top="-2"
            borderRadius="50%"
            borderBottomRightRadius="0"
            color="bg.500"
            cursor="pointer"
          >
            <ShadedButton onClick={() => dispatch(removeDir(index))}>
              <RxCrossCircled size="1.2rem" />
            </ShadedButton>
          </RegularBox>
        )}
      </RegularBox>
    </Collapse>
  );
};

export default CustomRate;
