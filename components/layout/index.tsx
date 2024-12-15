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
  Progress,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";

import axios from "axios";
import { setIP, setCity } from "../../redux/mainReducer";
import { initCurrencyConverterFetcher } from "../../services/fetchers";

import Nav from "./nav";
import { batch } from "react-redux";
import HeadHTML from "./HeadHTML";

import { useRouter } from "next/router";
import { ICity } from "../../types/exchange";

const Layout = ({ children }: { children: any }) => {
  // const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  //const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);
  const myToast = useAppSelector((state) => state.main.toast);
  const toast = useToast();
  const { query } = useRouter();
  const cityInSlugExists = query?.exchange && query.exchange.includes("-in-");

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetcher = initCurrencyConverterFetcher();
    fetcher().then((resp) => {
      if (resp.data) {
        const { ip, ...city } = resp.data as ICity & { ip: string };
        batch(() => {
          !cityInSlugExists && dispatch(setCity(city));
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

  const dirRatesStatus = useAppSelector((state) => state.main.dirRatesStatus);
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
      {/* <Box>
        {Object.values({
          "10": "#fdf6f3",
          "50": "#faddde",
          "100": "#f7dace",
          "200": "#f1c4b5",
          "300": "#efbaa3",
          "400": "#dfa694",
          "500": "#cd9b85",
          "600": "#b78a77",
          "700": "#9a7564",
          "800": "#684f44",
          "900": "#584339",
          "1000": "#3f3029",
        }).map((v) => (
          <Box w="10" h="10" bg={v} />
        ))}
      </Box> */}
      {/* <Box
        w="10"
        h="10"
        bg={dirRatesStatus !== "fulfilled" ? "red.500" : "green.500"}
      /> */}

      <Box
        position="absolute"
        w="100%"
        h="80vh"
        bgGradient={`radial-gradient(circle at 50% -10%, ${ambientColor} 0%, transparent 40%)`}
      ></Box>
      <Header />
      {dirRatesStatus !== "fulfilled" ? (
        <Progress size="xs" isIndeterminate colorScheme="peach" />
      ) : (
        <Box h="1" />
      )}
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
