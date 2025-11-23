import React, { useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import {
  useToast,
  Box,
  VStack,
  useColorModeValue,
  Progress,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { batch } from "react-redux";
import {
  setCity,
  setIP,
  setFingerprintHash,
  setUserAgent,
} from "../../redux/mainReducer";
import { initCurrencyConverterFetcher } from "../../services/fetchers";
import { ICity } from "../../types/exchange";
import { useRouter } from "next/router";
import Fingerprint from "fingerprinter-js";

const Layout = ({ children }: { children: any }) => {
  // const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  //const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);
  const myToast = useAppSelector((state) => state.main?.toast);
  const toast = useToast();
  const { asPath } = useRouter();
  const lastString = asPath.split("/")[asPath.split("/").length - 1];
  const isCash =
    lastString.startsWith("cash-") || lastString.includes("-cash-");
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetcher = initCurrencyConverterFetcher();
    fetcher().then((resp) => {
      if (resp.data) {
        const { ip, ...cityData } = resp.data as any;

        batch(() => {
          !isCash && cityData?.city && dispatch(setCity(cityData.city));
          dispatch(setIP(ip));
        });
      }
    });
    Fingerprint.generate()
      .then((res) => {
        batch(() => {
          dispatch(setFingerprintHash(res.fingerprint));
          dispatch(setUserAgent(res.components.userAgent));
        });
      })
      .catch((error) => {
        console.error("Failed to generate fingerprint", error);
      });
  }, []);

  useEffect(() => {
    if (!myToast.title) return;
    const { timeBeforeClosing, ...toastConfig } = myToast;
    toast({
      ...toastConfig,
      duration: timeBeforeClosing,
      isClosable: true,
    });
  }, [myToast, toast]);

  const loadingStatus = useAppSelector((state) => state.main.loading);
  const ambientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(247, 197, 177, 0.1)"
  );

  return (
    <Box // careful! populars may stop working!
      overflowX="hidden"
      w="100%"
      position="relative"
      fontFamily="Rubik, sans-serif"
      sx={{
        "&::WebkitScrollbar": {
          width: "0",
        },
        "&::WebkitOverflowScrolling": "touch",
      }}
    >
      <Header />
      <Box
        position="absolute"
        w="100%"
        h="99vh"
        zIndex={0}
        pointerEvents="none" // <-- lets all clicks/touches pass through
        bgGradient={`radial-gradient(circle at 50% -10%, ${ambientColor} 0%, transparent 40%)`}
      />

      {loadingStatus === "pending" && (
        <Progress
          size="xs"
          isIndeterminate
          colorScheme="peach"
          filter="opacity(0.2)"
          position="fixed"
          top="0"
          left="0"
          right="0"
          zIndex="popover"
        />
      )}
      <Box h="1" />
      <VStack
        alignItems="center"
        justifyContent="space-between"
        gap="4"
        minH="calc(100vh - 56px)"
      >
        <Box mt={["1", "2"]} maxW={{ base: "100%", md: "888px" }} w="100%">
          {children}
        </Box>

        <Footer />
      </VStack>
    </Box>
  );
};

export default Layout;
