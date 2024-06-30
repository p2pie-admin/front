import React, { ReactChild, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import {
  useToast,
  Text,
  Box,
  VStack,
  useColorModeValue,
  Grid,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import axios from "axios";
import { setIP, setLocation } from "../../redux/mainReducer";
import { initCurrencyConverterFetcher } from "../../services/fetchers";
import { ILocation } from "../../types/shared";
import Nav from "./nav";
import { batch } from "react-redux";
import HeadHTML from "./HeadHTML";
import { ICities } from "../../types/exchange";

const Layout = ({ children }: { children: any }) => {
  // const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  //const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);
  const myToast = useAppSelector((state) => state.main.toast);
  const toast = useToast();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetcher = initCurrencyConverterFetcher();
    fetcher().then((resp) => {
      if (resp.data) {
        const { ip, ...location } = resp.data as ILocation & { ip: string };
        batch(() => {
          dispatch(setLocation(location));
          dispatch(setIP(ip));
        });
      }
    });
    // const url = "https://ip.nf/me.json";
    // axios.get(url).then((resp) => {
    //   if (resp.data?.ip) {
    //     const { country, city, ip } = resp.data?.ip;
    //     dispatch(setLocation({ en_country_name: country, en_city_name: city }));
    //     dispatch(setIP(ip?.split(".").slice(0, -1).join("."))); // берем только часть IP
    //   }
    // });
  }, []);

  useEffect(() => {
    myToast.title &&
      toast({
        ...myToast,
        isClosable: true,
      });
  }, [myToast]);

  const ambientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(247,178,177,0.1)"
  );

  return (
    <Box // careful! populars may stop working!
      w="100%"
      overflowX="hidden"
      position="relative"
      fontFamily="Roboto, sans-serif"
      sx={{
        "&::WebkitScrollbar": {
          width: "0",
        },
        "&::WebkitOverflowScrolling": "touch",
      }}
    >
      {/* <Box minH="-webkit-fill-available" p="1" w="100%" bgColor="red.500">
       
      </Box> */}
      <Box
        position="absolute"
        w="100%"
        h="80vh"
        bgGradient={`radial-gradient(circle at 50% -10%, ${ambientColor} 0%, transparent 40%)`}
      ></Box>
      <Header />
      <VStack
        alignItems="center"
        justifyContent="space-between"
        gap="4"
        minH="calc(100vh - 56px)"
      >
        <Box mt={["1", "4"]} maxW={{ base: "100%", md: "888px" }}>
          {children}
        </Box>

        <Footer />
      </VStack>
    </Box>
  );
};

export default Layout;
