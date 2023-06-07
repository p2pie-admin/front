import React, { ReactChild } from "react";
import Header from "./header";
import LayoutMeta from "./LayoutMeta";
import { useRouter } from "next/router";
import Footer from "./footer";
import {
  Box,
  Flex,
  useBreakpointValue,
  useColorModeValue,
  useToken,
  VStack,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { decrementSwiper, incrementSwiper } from "../../redux/mainReducer";

const Layout = ({ children }: { children: ReactChild }) => {
  const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);

  return (
    <>
      <VStack // careful! populars may stop working!
        justifyContent="space-between"
        w="100%"
        pb="0 !important"
        position="relative"
        overflowY={isScrollLocked ? "hidden" : "scroll"}
        overflowX="hidden"
        h="100vh"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
          "&::-webkit-overflow-scrolling": "touch",
        }}
      >
        <Header />

        <VStack alignItems="center" mt="4" w="100%" maxW={maxW} p="4">
          {children}
        </VStack>
        <Footer />
      </VStack>
    </>
  );
};

export default Layout;
