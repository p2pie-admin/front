import ResizeObserver from "resize-observer-polyfill";
import { AnimatePresence } from "framer-motion";
import { ToggleLayer } from "react-laag";

import Petals from "./Petals";
import {
  Box,
  Button,
  Center,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { useAppSelector } from "../../../../../redux/hooks";
import { useContext, useRef, useState } from "react";

import { IoAddSharp } from "react-icons/io5";
import { BsCheckLg } from "react-icons/bs";
import SideContext from "../../../../shared/SideContext";

function PopularSide() {
  //const activeSide = useAppSelector((state) => state.main.activeSide);
  const pms = useAppSelector((state) =>
    state.main.pms.filter((pm) => pm.popular_as && pm.popular_as !== "none")
  );
  // const completed = useAppSelector(
  //   (state) => state.main.popularCompleted === side
  // );

  const [isOpen, setOpen] = useState(false);

  const ref = useRef();
  useOutsideClick({
    ref,
    handler: () => setOpen(false),
  });

  return (
    <Box>
      <ToggleLayer
        isOpen={isOpen}
        ResizeObserver={ResizeObserver}
        placement={{
          anchor: "CENTER",
        }}
        renderLayer={({ isOpen, layerProps }) => {
          return (
            <AnimatePresence>
              {isOpen && <Petals {...layerProps} pms={pms} />}
            </AnimatePresence>
          );
        }}
      >
        {({ triggerRef }) => (
          <Center
            transform={isOpen ? "rotate(45deg)" : "none"}
            onClick={() => setOpen(!isOpen)}
            ref={triggerRef}
            transition="all .3s ease"
            cursor="pointer"
            bgColor="rgba(200,200,200,0.05)"
            _hover={{
              color: useColorModeValue("secondary.800", "primary.100"),
              bgColor: "transparent",
            }}
            _active={{
              color: useColorModeValue("secondary.600", "primary.400"),
            }}
            p="1"
            borderRadius="50%"
            border="2px dashed"
            borderColor="bg.500"
          >
            <IoAddSharp size="1.5rem" />
          </Center>
        )}
      </ToggleLayer>
    </Box>
    // <Box>
    //   <ToggleLayer
    //     isOpen={true}
    //     ResizeObserver={ResizeObserver}
    //     placement={{
    //       anchor: "CENTER",
    //     }}
    //     renderLayer={({ isOpen, layerProps }) => {
    //       return (
    //         <AnimatePresence>
    //           {isOpen && <Petals {...layerProps} pms={pms} />}
    //         </AnimatePresence>
    //       );
    //     }}
    //   >
    //     {({ triggerRef }) => <Button ref={triggerRef}>test</Button>}
    //   </ToggleLayer>
    // </Box>
  );
}

export default PopularSide;
