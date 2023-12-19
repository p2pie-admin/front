import {
  Box,
  HStack,
  Collapse,
  Text,
  VStack,
  useColorModeValue,
  IconButton,
  Button,
  useToken,
  useBreakpointValue,
  Fade,
} from "@chakra-ui/react";
import { TbArrowsExchange } from "react-icons/tb";
import SideContext from "../../../../components/shared/contexts/SideContext";
import { RegularBox } from "../../../../styles/theme/custom";

import PmModalButton from "../../../../components/main/side/pmModalButton";

import P2PContext from "../../../../components/shared/contexts/p2pContext";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import Collapsed from "./collapsed";
import { removeDir, triggerP2PDir } from "../../../../redux/mainReducer";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { motion, useDragControls } from "framer-motion";
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
  const [startedClientX, setStartedClientX] = useState(0);

  const [bg700, bg200] = useToken("colors", ["bg.700", "bg.200"]);
  const bg = useColorModeValue(bg200, bg700);

  const dispatch = useAppDispatch();

  return (
    <Collapse in={!dir.deleted}>
      <RegularBox
        key={index}
        variant={"no_contrast"}
        mt={[3, 4]}
        mb={[2, 3]}
        overflowX="hidden"
        p="2"
        boxShadow="md"
      >
        <P2PContext.Provider value={index}>
          <Box
            bgColor="red.500"
            boxShadow={`inset 0 0 -2px 8px ${bg}`}
            pos="relative"
            zIndex="1"
          >
            <motion.div
              style={{ width: "100%" }}
              onPointerMove={(e) => {
                if (startedClientX - e.clientX > 150) {
                  dispatch(removeDir(index));
                }
              }}
              onTouchStart={(e) =>
                setStartedClientX(e.changedTouches[0].clientX)
              }
              onTouchEnd={(e) => {
                setStartedClientX(0);
              }}
              onMouseDown={(e) => setStartedClientX(e.clientX)}
              onMouseUp={(e) => {
                setStartedClientX(0);
              }}
              drag="x"
              dragConstraints={{
                left: 5,
                right: 0,
              }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 30 }}
              dragElastic={{ left: 0.3, right: 0 }}
              whileTap={{ cursor: "grabbing" }}
              dragDirectionLock
            >
              <HStack
                zIndex="1"
                borderRadius="lg"
                spacing={["2", "4"]}
                cursor="pointer"
                color="bg.300"
                bgColor="bg.700"
                boxShadow={`0 0 0 5px ${bg}`}
                onClick={() => dir.defRate && dispatch(triggerP2PDir(index))}
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
            </motion.div>
            <Box zIndex="-1" pos="absolute" right="3" top="3" color="bg.50">
              <RiDeleteBinFill size="1.2rem" />
            </Box>
          </Box>

          <Collapsed />
        </P2PContext.Provider>
      </RegularBox>
    </Collapse>
  );
};

export default CustomRate;
