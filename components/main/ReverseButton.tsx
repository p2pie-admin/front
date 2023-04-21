import {
  useColorModeValue,
  Center,
  Button,
  Icon,
  Spinner,
  IconButton,
  useToken,
  Box,
  Grid,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { CgArrowsExchange } from "react-icons/cg";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { reverseDir } from "../../redux/mainReducer";
import { batch } from "react-redux";
import { fetchDirRates } from "../../redux/thunks";

const Patch = () => {
  const [bg900] = useToken("colors", ["bg.900"]);
  return (
    <Box position="absolute" zIndex="2">
      <Box
        w="30"
        h="10"
        background={`radial-gradient(circle at 0 100%, rgba(11, 111, 111, 0) 10px,${bg900} 11px), 
      radial-gradient(circle at 100% 100%, rgba(111, 0, 0, 0) 10px, ${bg900} 11px)`}
        backgroundPosition="bottom left, bottom right"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
      <Box
        w="40"
        h="10"
        background={`radial-gradient(circle at 100% 0, rgba(1, 111, 0, 0) 10px, ${bg900} 11px), 
  radial-gradient(circle at 0 0, rgba(204, 111, 0, 0) 10px, ${bg900} 11px)`}
        backgroundPosition="top right, top left"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
    </Box>
  );
};

const ReverseButton = () => {
  const dispatch = useAppDispatch();

  const pendingDirRates = useAppSelector((state) => state.main.pendingDirRates);
  const bothPmsSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );

  const handleReverseDir = () => {
    batch(() => {
      dispatch(reverseDir());
      dispatch(fetchDirRates({}));
    });
  };

  const [bg800] = useToken("colors", ["bg.800"]);

  return (
    <Grid
      gridTemplateColumns="1fr 80px 1fr"
      h="4"
      bgColor="bg.900"
      borderRadius="3xl"
    >
      <Box borderRadius="xl" bgColor="bg.800"></Box>

      <Center position="relative" w="100%">
        <Box position="absolute">
          <Button
            w="4"
            p="0"
            variant="black"
            onClick={handleReverseDir}
            color={bothPmsSelected ? "bg.200" : "bg.500"}
            zIndex="3"
            isLoading={pendingDirRates}
            aria-label="Reverse direction"
          >
            {bothPmsSelected ? (
              <BiRefresh size="2rem" />
            ) : (
              <CgArrowsExchange size="2rem" />
            )}
          </Button>
        </Box>
        <Patch />
      </Center>

      <Box borderRadius="xl" bgColor="bg.800"></Box>
    </Grid>
    // <Center w="100%" h="2" p="0">
    //   <IconButton
    //     border={`6px solid ${bg800}`}
    //     onClick={handleReverseDir}
    //     borderRadius="50%"
    //     bgColor="bg.700"
    //     color={bothPmsSelected ? "bg.300" : "bg.600"}
    //     zIndex="2"
    //     isLoading={pendingDirRates}
    //     aria-label="Reverse direction"
    //     icon={
    //       bothPmsSelected ? (
    //         <BiRefresh size="2rem" />
    //       ) : (
    //         <IoChevronDownOutline size="2rem" />
    //       )
    //     }
    //   />
    // </Center>
  );
};

export default ReverseButton;
