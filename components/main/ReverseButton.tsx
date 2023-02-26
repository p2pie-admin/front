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
import { IoChevronDownOutline } from "react-icons/io5";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { reverseDir } from "../../redux/mainReducer";
import { batch } from "react-redux";
import { fetchDirTops } from "../../redux/thunks";

const ReverseButton = () => {
  const dispatch = useAppDispatch();

  const pendingDirTops = useAppSelector((state) => state.main.pendingDirTops);
  const bothPmsSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );

  const handleReverseDir = () => {
    batch(() => {
      dispatch(reverseDir());
      dispatch(fetchDirTops({}));
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
          <IconButton
            onClick={handleReverseDir}
            borderRadius="50%"
            color={bothPmsSelected ? "bg.300" : "bg.600"}
            zIndex="2"
            isLoading={pendingDirTops}
            aria-label="Reverse direction"
            icon={
              bothPmsSelected ? (
                <BiRefresh size="2rem" />
              ) : (
                <IoChevronDownOutline size="2rem" />
              )
            }
          />
        </Box>
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
    //     isLoading={pendingDirTops}
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
