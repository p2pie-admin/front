import React, { ReactChild, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import { useBreakpointValue, VStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { batch } from "react-redux";
import { fetchPms, fetchFiat } from "../../redux/thunks";

const Layout = ({ children }: { children: ReactChild }) => {
  const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);

  const dispatch = useAppDispatch();

  useEffect(() => {
    batch(() => {
      dispatch(fetchPms());
      dispatch(fetchFiat());
    });
  }, []);

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

        <VStack alignItems="center" mt="4" w="100%" maxW={maxW}>
          {children}
        </VStack>
        <Footer />
      </VStack>
    </>
  );
};

export default Layout;
