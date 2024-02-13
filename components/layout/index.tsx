import React, { ReactChild, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import { useBreakpointValue, useToast, VStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { batch } from "react-redux";
import { fetchPms, fetchFiat } from "../../redux/thunks";
import axios from "axios";
import { setIP, setLocation } from "../../redux/mainReducer";
import { ResponsiveText } from "../../styles/theme/custom";

const Layout = ({ children }: { children: ReactChild }) => {
  const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);
  const myToast = useAppSelector((state) => state.main.toast);
  const toast = useToast();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const url = "https://ip.nf/me.json";
    axios.get(url).then((resp) => {
      if (resp.data?.ip) {
        const { country, city, ip } = resp.data?.ip;
        dispatch(setLocation({ en_country_name: country, en_city_name: city }));
        dispatch(setIP(ip?.split(".").slice(0, -1).join("."))); // берем только часть IP
      }
    });
    batch(() => {
      dispatch(fetchPms());
      dispatch(fetchFiat());
    });
  }, []);

  useEffect(() => {
    myToast.title &&
      toast({
        ...myToast,
        isClosable: true,
      });
  }, [myToast]);

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
