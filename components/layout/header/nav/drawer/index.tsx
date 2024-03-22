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
import LinkButton from "../../../../shared/LinkButton";
import { SiAddthis } from "react-icons/si";
import { FaMapMarkerAlt } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";
import { TbArrowsExchange } from "react-icons/tb";
import { FiHome } from "react-icons/fi";
import { FiPlusCircle } from "react-icons/fi";
import { RiMapPinLine, RiTokenSwapLine } from "react-icons/ri";
import { LiaTelegramPlane } from "react-icons/lia";
import { RiRobot2Line } from "react-icons/ri";
import SearchExchanger from "./SearchExchanger";

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
          maxW="260"
          onTouchStart={handleSwipeStart}
          bgColor={bgColor}
        >
          <DrawerCloseButton color="bg.500" />
          <DrawerHeader minH="14" py="2" px="8">
            <HStack>
              <Language />
              <Theme />
              <SearchExchanger />
            </HStack>
          </DrawerHeader>
          <DrawerBody onClick={onClose}>
            <LinkButton message="Home" href={"/"} CustomIcon={FiHome} />
            <LinkButton
              message="Suggest Exchange"
              href={"/order"}
              CustomIcon={FiPlusCircle}
            />
            <LinkButton
              message="Create Exchanger"
              href={"/exchanger"}
              CustomIcon={RiTokenSwapLine}
            />
            <LinkButton
              message="Exchangers Map"
              href={"/map"}
              CustomIcon={RiMapPinLine}
            />

            <LinkButton
              message="Contact Support"
              href={"https://t.me/p2pie"}
              CustomIcon={LiaTelegramPlane}
            />
            <LinkButton
              message="Telegram Bot"
              href={"https://t.me/p2pie_bot"}
              CustomIcon={RiRobot2Line}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SwipeableDrawer;
