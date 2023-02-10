import {
  Button,
  Icon,
  Image,
  ScaleFade,
  useOutsideClick,
  useToken,
} from "@chakra-ui/react";
import { ArrowRight } from "@styled-icons/heroicons-outline/ArrowRight";
import CircularMenu from "./circular-menu";
import { useRef, useState } from "react";
import {
  clearPms,
  setActiveDir,
  setActivePetal,
  setPm,
} from "../../../redux/mainReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { IDirGroup } from "../../../types/dir";
import DirSideContext from "./DirSideContext";
import { getPmsFromPmGroup } from "../side/pmModalButton/section/PmGroup/helper";
import { useSelector } from "react-redux";
import { HiArrowRight } from "react-icons/hi";

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
  const ref = useRef();

  const dispatch = useAppDispatch();
  const activeDir = useAppSelector((state) => state.main.activeDir);

  const clearSelectedPms = () => {
    dispatch(setActivePetal());
  };

  const handleDirClick = () => {
    activeDir !== dirId && dispatch(setActiveDir(dirId));
    //activeDir !== dirId && clearSelectedPms();
  };

  useOutsideClick({
    ref: ref,
    handler: () => {
      if (dirId === activeDir) {
        dispatch(setActiveDir(undefined));
        console.log("outside");
        //clearSelectedPms();
      }
    },
  });

  const [bg600] = useToken("colors", ["bg.600"]);

  return (
    <Button
      ref={ref}
      key={dirId}
      position="relative"
      transition="all .4s ease"
      bgColor="transparent"
      variant="main"
      boxShadow="none"
      filter={
        activeDir && activeDir !== dirId
          ? "opacity(0.1) grayscale(0.7)"
          : "unset"
      }
      //filter={activeDir ? "brightness(0.4) grayscale(0.7)" : "unset"}
      h="100%"
      p="0"
      onClick={handleDirClick}
      mx={{ base: "0", sm: "1" }}
      leftIcon={
        <DirSideContext.Provider value={"give"}>
          <ScaleFade initialScale={0.7} in delay={0.2 + index * 0.05}>
            <CircularMenu dirId={dirId} group={giveGroup} />
          </ScaleFade>
        </DirSideContext.Provider>
      }
      rightIcon={
        <DirSideContext.Provider value={"get"}>
          <ScaleFade initialScale={0.7} in delay={0.25 + index * 0.05}>
            <CircularMenu dirId={dirId} group={getGroup} />
          </ScaleFade>
        </DirSideContext.Provider>
      }
    >
      <Icon color="bg.300" as={HiArrowRight} w="5" h="5" />
    </Button>
  );
};

export default Dir;
