import {
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Icon,
  Image,
  Flex,
  useOutsideClick,
  Text,
} from "@chakra-ui/react";
import { ArrowRight } from "@styled-icons/heroicons-outline/ArrowRight";
import DirSide from "./dir-side";
import { useRef, useState } from "react";
import { setActiveDir, setActivePetal } from "../../../redux/mainReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { IDirGroup } from "../../../types/dir";
import DirSideContext from "./DirSideContext";
import { getPmsFromPmGroup } from "../side/pmModalButton/section/PmGroup/helper";
import { useSelector } from "react-redux";
import { FaExchangeAlt } from "react-icons/fa";
import { Box3D } from "../../../styles/theme/wrappers";
import { BsArrow90DegRight, BsArrow90DegUp } from "react-icons/bs";
import CircularIcon from "../../shared/CircularIcon";
import RegularIcon from "../../shared/RegularIcon";
import InsideDirArea from "./InsideDirArea";

const Dir = ({
  index,
  giveGroup,
  getGroup,
  dirId,
}: {
  index: number;
  giveGroup: IDirGroup;
  getGroup: IDirGroup;
  dirId: string;
}) => {
  const dispatch = useAppDispatch();
  const activeDir = useAppSelector((state) => state.main.activeDir);
  const [giveSelected, getSelected] = useAppSelector((state) => [
    !!state.main.givePm?.code,
    !!state.main.getPm?.code,
  ]);

  const clearSelectedPms = () => {
    dispatch(setActivePetal());
  };

  const handleDirClick = () => {
    activeDir !== dirId && dispatch(setActiveDir(dirId));
    //activeDir !== dirId && clearSelectedPms();
  };

  const activeSide =
    (!getSelected && !giveSelected) || getSelected ? "give" : "get";

  return (
    <Box3D
      key={dirId}
      bgColor="bg.800"
      position="relative"
      transition="all .4s ease"
      w="70px"
      h="70px"
      p="1"
      // variant="black"
      // color="bg.300"
      filter={
        activeDir && activeDir !== dirId
          ? "opacity(0.1) grayscale(0.7)"
          : "brightness(1)"
      }
      _hover={{
        filter:
          activeDir && activeDir !== dirId
            ? "opacity(0.1) grayscale(0.7)"
            : "brightness(1.2) grayscale(0)",
      }}
      //filter={activeDir ? "brightness(0.4) grayscale(0.7)" : "unset"}

      onClick={handleDirClick}
      // leftIcon={
      //   <DirSideContext.Provider value={"give"}>
      //     <ScaleFade initialScale={0.7} in delay={0.2 + index * 0.05}>
      //       <CircularMenu dirId={dirId} group={giveGroup} />
      //     </ScaleFade>
      //   </DirSideContext.Provider>
      // }
      // rightIcon={
      //   <DirSideContext.Provider value={"get"}>
      //     <ScaleFade initialScale={0.7} in delay={0.25 + index * 0.05}>
      //       <CircularMenu dirId={dirId} group={getGroup} />
      //     </ScaleFade>
      //   </DirSideContext.Provider>
      // }
    >
      {activeDir && activeDir === dirId ? (
        <Center h="100%">
          <Text fontSize="sm" color="bg.200" textAlign="center">
            YOU {activeSide === "give" ? "SELL" : "BUY"}
          </Text>
        </Center>
      ) : (
        <Grid
          gridTemplateColumns="1fr 1fr"
          gridTemplateRows="1fr 1fr"
          color="bg.400"
        >
          <Box>
            <RegularIcon
              url={giveGroup?.icon?.url}
              index={+giveGroup.icon.id}
            />
          </Box>

          <Center transform="rotate(90deg)" mt="3" mr="3">
            <BsArrow90DegRight />
          </Center>

          <Center mb="3" ml="3">
            <BsArrow90DegUp />
          </Center>

          <Box>
            <RegularIcon url={getGroup?.icon?.url} index={+getGroup.icon.id} />
          </Box>
        </Grid>
      )}

      <Box position="absolute" top="35%" left="50%">
        <DirSide dirId={dirId} group={getGroup} />
      </Box>

      <InsideDirArea active={activeDir === dirId} />
    </Box3D>
  );
};

export default Dir;
