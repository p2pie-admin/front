import { Button, Icon, Image, useOutsideClick } from "@chakra-ui/react";
import { ArrowRight } from "@styled-icons/heroicons-outline/ArrowRight";
import PopularSide from "./circular-menu";
import PopularSideContext from "./PopularSideContext";
import { useRef, useState } from "react";
import { clearPms, setActivePopular, setPm } from "../../../redux/mainReducer";
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

  const clearSelectedPms = () => {
    dispatch(clearPms());
  };

  const handleDirClick = () => {
    //clearSelectedPms();
    if (giveGroup.pms.length > 1 || getGroup.pms.length > 1) {
      dispatch(setActivePopular(dirId));
    }

    // если в одном из популярных всего один вариант, то ставим его выбранным в селекторе
    [giveGroup, getGroup].map(({ pms }, index) => {
      if (pms.length < 1) return;
      if (pms.length < 2)
        dispatch(setPm({ pm: pms[0], side: index ? "get" : "give" }));
    });
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
      borderRadius="2rem"
      leftIcon={
        <PopularSideContext.Provider value={"give"}>
          <PopularSide dirId={dirId} group={giveGroup} />
        </PopularSideContext.Provider>
      }
      rightIcon={
        <PopularSideContext.Provider value={"get"}>
          <PopularSide dirId={dirId} group={getGroup} />
        </PopularSideContext.Provider>
      }
    >
      <Icon as={ArrowRight} w="4" h="4" />
    </Button>
  );
};

export default PopularDir;
