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
import { clearPms, setActiveDir, setPm } from "../../../redux/mainReducer";
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
    dispatch(clearPms());
  };

  const handleDirClick = () => {
    //clearSelectedPms();
    if (giveGroup.pms.length > 1 || getGroup.pms.length > 1) {
      dispatch(setActiveDir(dirId));
    }
  };

  useOutsideClick({
    ref: ref,
    handler: () => dispatch(setActiveDir(undefined)),
  });

  const [bg600] = useToken("colors", ["bg.600"]);

  return (
    <Button
      ref={ref}
      key={dirId}
      onClick={handleDirClick}
      position="relative"
      variant="primary_dark"
      border={`solid 2px ${bg600}`}
      filter={activeDir ? "brightness(0.4) grayscale(0.7)" : "unset"}
      h="100%"
      p="0"
      mx={{ base: "0", sm: "1" }}
      borderRadius="2rem"
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
