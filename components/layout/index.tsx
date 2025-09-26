import React, { useEffect } from "react";
import Header from "./header";
import Footer from "./footer";
import {
  useToast,
  Box,
  VStack,
  useColorModeValue,
  Progress,
} from "@chakra-ui/react";
import { useAppSelector } from "../../redux/hooks";

const Layout = ({ children }: { children: any }) => {
  // const maxW = useBreakpointValue({ base: "100%", lg: "980" });
  //const isScrollLocked = useAppSelector((state) => state.main.isScrollLocked);
  const myToast = useAppSelector((state) => state.main.toast);
  const toast = useToast();
  //const { query } = useRouter();
  //const cityInSlugExists = query?.exchange && query.exchange.includes("-in-");

  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   const fetcher = initCurrencyConverterFetcher();
  //   fetcher().then((resp) => {
  //     if (resp.data) {
  //       const { ip, ...city } = resp.data as ICity & { ip: string };
  //       batch(() => {
  //         !cityInSlugExists && dispatch(setCity(city));
  //         dispatch(setIP(ip));
  //       });
  //     }
  //   });
  // }, []);

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
      position="relative"
      fontFamily="Roboto, sans-serif"
      sx={{
        "&::WebkitScrollbar": {
          width: "0",
        },
        "&::WebkitOverflowScrolling": "touch",
      }}
    >
      <Header />
      <Box
        position="absolute"
        w="100%"
        h="80vh"
        zIndex={100}
        pointerEvents="none" // <-- lets all clicks/touches pass through
        bgGradient={`radial-gradient(circle at 50% -10%, ${ambientColor} 0%, transparent 40%)`}
      />

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
        <Box mt={["1", "4"]} maxW={{ base: "100%", md: "888px" }} w="100%">
          {children}
        </Box>

        <Footer />
      </VStack>
    </Box>
  );
};

export default Layout;
