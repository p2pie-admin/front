import React, { ReactChild } from "react";
import Header from "./header";
import LayoutMeta from "./LayoutMeta";
import { useRouter } from "next/router";
import Footer from "./footer";
import { Box, Flex, useColorModeValue, useToken } from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks";
import Shader from "../shared/Shader";
import { noiseURL } from "../../styles/theme/noise";

const Layout = ({ children }: { children: ReactChild }) => {
  const router = useRouter();

  const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);

  return (
    <>
      <Box
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

          <Footer />
        </Box>
      </Box>
      <Box position="absolute" bottom="0" w="100%">
        <Shader toTop bgColor="bg.900" />
      </Box>
    </>
  );
};

export default Layout;
