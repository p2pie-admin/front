import { Button, Icon, Image, useOutsideClick } from "@chakra-ui/react";
import { ArrowRight } from "@styled-icons/heroicons-outline/ArrowRight";
import CircularMenu from "./circular-menu";
import PopularSideContext from "./PopularSideContext";
import { useRef, useState } from "react";
import { setActivePopular } from "../../../redux/mainReducer";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { IPopularGroup } from "../../../types/popular";

const PopularDir = ({
  giveGroup,
  getGroup,
  dirId,
}: {
  giveGroup: IPopularGroup;
  getGroup: IPopularGroup;
  dirId: string;
}) => {
  const ref = useRef();

  const dispatch = useAppDispatch();
  const activePopular = useAppSelector((state) => state.main.activePopular);

  const handleDirClick = () => {
    if (activePopular === dirId) {
      dispatch(setActivePopular(undefined));
      return;
    }
    dispatch(setActivePopular(dirId));
  };

  useOutsideClick({
    ref: ref,
    handler: () => dispatch(setActivePopular(undefined)),
  });

  return (
    <Button
      filter={"brightness(1)"}
      ref={ref}
      key={dirId}
      onClick={handleDirClick}
      position="relative"
      variant="primary_dark"
      h="100%"
      p="0"
      mx="5"
      borderRadius="2rem"
      leftIcon={
        <PopularSideContext.Provider value={"give"}>
          <CircularMenu dirId={dirId} group={giveGroup} />
        </PopularSideContext.Provider>
      }
      rightIcon={
        <PopularSideContext.Provider value={"get"}>
          <CircularMenu dirId={dirId} group={getGroup} />
        </PopularSideContext.Provider>
      }
    >
      <Icon as={ArrowRight} w="4" h="4" />
    </Button>
  );
};

export default PopularDir;
