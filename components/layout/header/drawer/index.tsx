import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
  useColorModeValue,
  Box,
  HStack,
  Button,
  Wrap,
  WrapItem,
  Text,
  Divider,
} from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { AiOutlineMenu } from "react-icons/ai";
import { BsTelegram } from "react-icons/bs";
import NavBody from "../../nav/NavBody";
import NavButton from "../../nav/NavButton";
import GlobalSearch from "../../nav/globalSearch";
import DarkLightTheme from "../../nav/DarkLightTheme";

// Quick entry points into the money pages; also plain internal links for crawlers.
export const POPULAR_DIRECTIONS = [
  { label: "USDT → Сбер", href: "/tether-usdt-trc20-to-sber-rub" },
  { label: "BTC → Сбер", href: "/bitcoin-btc-to-sber-rub" },
  { label: "USDT → T-bank", href: "/tether-usdt-trc20-to-t-bank-rub" },
  { label: "USDT → СБП", href: "/tether-usdt-trc20-to-sbp-rub" },
  { label: "Сбер → USDT", href: "/sber-rub-to-tether-usdt-trc20" },
  { label: "Наличные → USDT", href: "/cash-rub-to-tether-usdt-trc20" },
];

const SwipeableDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const bgColor = useColorModeValue("bg.100", "bg.700");
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_CHAT || "https://t.me/p2pie";
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
    <Box display={{ base: "block", xl: "none" }}>
      <NavButton handleClick={onOpen} icon={AiOutlineMenu} />

      <Drawer
        finalFocusRef={btnRef as any}
        placement="left"
        size="xs"
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerOverlay bgColor="blackAlpha.200" />
        <DrawerContent
          w="fit-content"
          minW="300px"
          maxW="90vw"
          onTouchStart={handleSwipeStart}
          bgColor={bgColor}
        >
          <DrawerCloseButton color="bg.500" />
          <DrawerBody px="3" pt="12" pb="6" display="flex" flexDir="column">
            <Box mb="3">
              <GlobalSearch alwaysOpen onNavigate={onClose} />
            </Box>
            <Box onClick={onClose}>
              <NavBody />
            </Box>

            <Divider my="3" />
            <Text fontSize="xs" color="bg.400" mb="2" ml="2" textTransform="uppercase" letterSpacing="wide">
              Популярные направления
            </Text>
            <Wrap spacing="2" mb="4" onClick={onClose}>
              {POPULAR_DIRECTIONS.map((d) => (
                <WrapItem key={d.href}>
                  <Button
                    as={NextLink}
                    href={d.href}
                    prefetch={false}
                    size="sm"
                    variant="outline"
                    borderColor="bg.500"
                    color="bg.200"
                    fontWeight="500"
                  >
                    {d.label}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>

            <HStack mt="auto" justifyContent="space-between">
              <Button
                as="a"
                href={telegram}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                color="white"
                size="md"
                leftIcon={<BsTelegram size="1.1rem" />}
                flex="1"
              >
                Telegram
              </Button>
              <DarkLightTheme />
            </HStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default SwipeableDrawer;
