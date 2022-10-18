import React, { ReactChild } from "react";
import Header from "./header";
import LayoutMeta from "./LayoutMeta";
import { useRouter } from "next/router";
import Footer from "./footer";
import { Box, Flex } from "@chakra-ui/react";

const Layout = ({ children }: { children: ReactChild }) => {
  const router = useRouter();
  return (
    <Box w="100%" position="relative">
      <Header />
      <Flex
        flexDir="column"
        alignItems="center"
        minH="120vh"
        sx={{
          "&::-webkit-overflow-scrolling": "touch",
        }}
      >
        {children}
      </Flex>
      <Footer />
    </Box>
  );
};

export default Layout;
