import React, { ReactChild, useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import {
  useBreakpointValue,
  useToast,
  Text,
  Box,
  VStack,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { batch } from "react-redux";
import { fetchPms, fetchFiat } from "../../redux/thunks";
import axios from "axios";
import { setIP, setLocation } from "../../redux/mainReducer";
import { ResponsiveText } from "../../styles/theme/custom";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const Layout = ({ children }: { children: any }) => {
  // const maxW = useBreakpointValue({ base: "100%", lg: "980" });
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
  const ambientColor = useColorModeValue(
    "rgba(143,92,292,0.1)",
    "rgba(247,178,177,0.05)"
  );
  return (
    <Box // careful! populars may stop working!
      // justifyContent="center"
      w="100%"
      bgGradient={`radial-gradient(circle at 50% -10%, ${ambientColor} 0%, transparent 40%)`}
      //pb="0 !important"
      fontFamily="Roboto, sans-serif"
      maxH="-webkit-fill-available"
      overflowY="hidden"
      position="relative"
      sx={{
        "&::-webkit-scrollbar": {
          width: "0",
        },
        "&::-webkit-overflow-scrolling": "touch",
      }}
    >
      {/* <Box minH="-webkit-fill-available" p="1" w="100%" bgColor="red.500">
       
      </Box> */}
      <Header />

      <VStack alignItems="center" mt={[2, 4, 8]}>
        {children}
      </VStack>
    </Box>
  );
};

export default Layout;
