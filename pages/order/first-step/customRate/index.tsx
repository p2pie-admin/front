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
// const PmWrapper = ({ children }: { children: React.ReactChild }) => {
//   const borderColor = useColorModeValue("blackAlpha.500", "whiteAlpha.300");
//   return (
//     <Button p="2" variant="contrast">
//       <HStack>{children}</HStack>
//     </Button>
//   );
// };

const CustomRate = ({ index }: { index: number }) => {
  const [startedClientX, setStartedClientX] = useState(-10000);
  const [collapsed, setCollapsed] = useState(true);
  const [isDeleted, setDeleted] = useState(false);

  const isVisible = useAppSelector(
    (state) => state.main.p2p.dirs[index].isVisible
  );
  const ratesExist = useAppSelector(
    (state) => !!state.main.p2p.dirs[index].currencyConverterRate?.rate
  );
  const [bg800, bg200] = useToken("colors", ["bg.800", "bg.200"]);
  const bg = useColorModeValue(bg200, bg800);

  const dispatch = useAppDispatch();

  return (
    <Collapse in={collapsed}>
      <RegularBox
        key={index}
        variant={"contrast"}
        mt={[3, 4]}
        mb={[2, 3]}
        overflowX="hidden"
        p="2"
        boxShadow="md"
      >
        <P2PContext.Provider value={index}>
          <Box
            bgColor="red.500"
            boxShadow={`inset 2px 0 0 5px ${bg}`}
            pos="relative"
            zIndex="1"
          >
            <motion.div
              style={{ width: "100%" }}
              onPointerMove={(e) => {
                if (startedClientX - e.clientX > 150 && !isDeleted) {
                  console.log("deleted" + index);
                  setDeleted(true);
                  setStartedClientX(-10000);
                  index !== 0 && setCollapsed(false);
                  setTimeout(() => dispatch(removeDir(index)), 300);
                }
              }}
              onMouseDown={(e) => setStartedClientX(e.clientX)}
              onMouseUp={(e) => {
                setStartedClientX(-10000);
                setDeleted(false);
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
                bgColor="bg.800"
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
