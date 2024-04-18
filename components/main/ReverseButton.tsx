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
import { useRouter } from "next/router";
import { RegularBox } from "../../styles/theme/custom";

const Patch = () => {
  const [bg10, bg900] = useToken("colors", ["bg.10", "bg.900"]);
  const color1 = useColorModeValue(bg10, bg900);
  return (
    <Box position="absolute" zIndex="2">
      <Box
        w="30"
        h="8"
        background={`radial-gradient(circle at 0 100%, rgba(11, 111, 111, 0) 15px,${color1} 16px), 
      radial-gradient(circle at 100% 100%, rgba(111, 0, 0, 0) 15px, ${color1} 16px)`}
        backgroundPosition="bottom left, bottom right"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
      <Box
        w="40"
        h="8"
        background={`radial-gradient(circle at 100% 0, rgba(1, 111, 0, 0) 15px, ${color1} 16px), 
  radial-gradient(circle at 0 0, rgba(204, 111, 0, 0) 15px, ${color1} 16px)`}
        backgroundPosition="top right, top left"
        backgroundSize=" 50% 50%"
        backgroundRepeat="no-repeat"
      ></Box>
    </Box>
  );
};

const ReverseButton = () => {
  const dispatch = useAppDispatch();

  const color2 = useColorModeValue("bg.700", "bg.200");

  const pendingDirRates = useAppSelector((state) => state.main.pendingDirRates);
  const bothPmsSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );
  const router = useRouter();
  const { dir, pm_groups } = router.query;
  let reverseSlug = () => {};
  if (typeof dir === "string" && typeof pm_groups === "string") {
    const reversedDir = `${dir.split("_")[1]}_${dir.split("_")[0]}`;
    const reversedPmGroups = `${pm_groups.split("_")[1]}_${
      pm_groups.split("_")[0]
    }`;
    reverseSlug = () =>
      router.push(
        `/?dir=${reversedDir}&pm_groups=${reversedPmGroups}`,
        undefined,
        {
          shallow: true,
        }
      );
  }

  const handleReverseDir = () => {
    reverseSlug();

    dispatch(reverseDir());

    // batch(() => {
    //   dispatch(reverseDir());
    //   dispatch(fetchDirRates({}));
    // });
  };

  return (
    <Center position="relative" w="100%" minH="5">
      <Box position="absolute">
        <Button
          w="4"
          p="0"
          variant="extra_contrast"
          onClick={handleReverseDir}
          color={bothPmsSelected ? color2 : "bg.500"}
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
