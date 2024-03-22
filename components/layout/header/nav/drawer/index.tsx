import {
  useDisclosure,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import NavButton from "../NavButton";
import Language from "./Language";
import Theme from "./Theme";

const SwipeableDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const bgColor = useColorModeValue("bg.100", "bg.700");
  const handleSwipeStart = (e: any) => {
    const startX = e.touches[0].clientX;

    const handleTouchMove = (e: any) => {
      const moveX = e.touches[0].clientX;
      // Swipe left to close
      if (startX < moveX - 30) {
        onClose();
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };

    document.addEventListener("touchmove", handleTouchMove);

    // Clean up the touchmove listener
    document.addEventListener("touchend", () => {
      document.removeEventListener("touchmove", handleTouchMove);
    });
  };

  return (
    <>
      <NavButton handleClick={onOpen} icon={AiOutlineMenu} />

      <Drawer
        finalFocusRef={btnRef as any}
        placement="right"
        size="xs"
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay bgColor="blackAlpha.200" />
        <DrawerContent
          maxW="300"
          onTouchStart={handleSwipeStart}
          bgColor={bgColor}
        >
          <DrawerCloseButton color="bg.500" />
          <DrawerHeader minH="14" p="2">
            <HStack>
              <Language />
              <Theme />
            </HStack>
          </DrawerHeader>
          <DrawerBody></DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SwipeableDrawer;
