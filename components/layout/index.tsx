import React, { ReactChild } from "react";
import Header from "./header";
import LayoutMeta from "./LayoutMeta";
import { useRouter } from "next/router";
import Footer from "./footer";
import { Box, Flex, useColorModeValue, useToken } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { decrementSwiper, incrementSwiper } from "../../redux/mainReducer";

const Layout = ({ children }: { children: ReactChild }) => {
  const router = useRouter();

  const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);

  return (
    <>
      <Flex // careful! populars may stop working!
        flexDir="column"
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
        <Box position="relative">
          <Flex flexDir="column" alignItems="center">
            {children}
          </Flex>
        </Box>
        <Footer />
      </Flex>
    </>
  );
};

export default Layout;
