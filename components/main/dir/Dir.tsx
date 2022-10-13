import { Button, Icon, Image, useOutsideClick } from "@chakra-ui/react";
import { ArrowRight } from "@styled-icons/heroicons-outline/ArrowRight";
import CircularMenu from "./circular-menu";
import { useRef, useState } from "react";
import { clearPms, setActiveDir, setPm } from "../../../redux/mainReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { IDirGroup } from "../../../types/dir";
import DirSideContext from "./DirSideContext";
import { getPmsFromPmGroup } from "../side/pmModalButton/section/PmGroup/helper";
import { useSelector } from "react-redux";

const Dir = ({
  giveGroup,
  getGroup,
  dirId,
}: {
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

  return (
    <Button
      ref={ref}
      key={dirId}
      onClick={handleDirClick}
      position="relative"
      variant="primary_black"
      filter={activeDir ? "brightness(0.6)" : "unset"}
      h="100%"
      p="0"
      borderRadius="2rem"
      leftIcon={
        <DirSideContext.Provider value={"give"}>
          <CircularMenu dirId={dirId} group={giveGroup} />
        </DirSideContext.Provider>
      }
      rightIcon={
        <DirSideContext.Provider value={"get"}>
          <CircularMenu dirId={dirId} group={getGroup} />
        </DirSideContext.Provider>
      }
    >
      <Icon as={ArrowRight} w="4" h="4" />
    </Button>
  );
};

export default Dir;
