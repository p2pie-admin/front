import React, { ReactChild } from "react";
import Header from "./header";
import LayoutMeta from "./LayoutMeta";
import { useRouter } from "next/router";
import Footer from "./footer";
import { Box, Flex } from "@chakra-ui/react";

const Layout = ({ children }: { children: ReactChild }) => {
  const router = useRouter();
  const bgGradient =
    "linear-gradient(0deg, rgba(38,34,45,1) 10%, rgba(88,79,98,0) 100%);";
  return (
    <>
      <Box
        w="100%"
        position="relative"
        overflowY="scroll"
        h="100vh"
        sx={{
          "&::-webkit-scrollbar": {
            width: "0",
          },
          "&::-webkit-overflow-scrolling": "touch",
        }}
      >
        <Header />
        <Flex flexDir="column" alignItems="center">
          {children}
        </Flex>
        <Footer />
      </Box>

      <Box
        position="absolute"
        bottom="0"
        w="100%"
        h="14"
        bg={bgGradient}
        left="0"
        pointerEvents="none"
      />
    </>
  );
};

export default Layout;
