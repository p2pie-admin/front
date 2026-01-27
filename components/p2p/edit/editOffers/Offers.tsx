import React, { useMemo, useState, useEffect, useRef } from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { IoAddOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  addP2PDirection,
  setP2PFullOffers,
} from "../../../../redux/mainReducer";
import { IFullOffer } from "../../../../types/p2p";
import { IPm } from "../../../../types/selector";
import DirectionItem from "./offer";
import Offer from "./offer";

const DirectionsPicker = ({
  offers,
  pms,
}: {
  offers?: IFullOffer[] | null;
  pms?: IPm[] | null;
}) => {
  const dispatch = useAppDispatch();
  const fullOffersCount = useAppSelector(
    (state) => state.main.p2pFullOffers.length,
  );
  const [opened, setOpened] = useState(0);

  const handleExpand = (event: any, index: number) => {
    if (index !== opened) return;
    event.preventDefault();
    event.stopPropagation();
    setOpened(index);
  };

  const fullOffers = useMemo(() => offers || [], [offers]);
  useEffect(() => {
    if (!fullOffers.length || fullOffersCount) return;
    dispatch(setP2PFullOffers(fullOffers));
  }, [dispatch, fullOffers, fullOffersCount]);

  const prevOpenedRef = useRef(opened);
  useEffect(() => {
    const prevOpened = prevOpenedRef.current;
    prevOpenedRef.current = opened;
    if (prevOpened === opened) return;
    if (prevOpened === 1000 || opened === 1000) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`direction-item-${opened}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [opened]);

  const directionIndexes = useMemo(
    () => Array.from({ length: fullOffersCount }, (_, index) => index),
    [fullOffersCount],
  );

  return (
    <VStack align="stretch" spacing="3" px="2">
      {directionIndexes.map((index) => (
        <Offer
          key={`direction-${index}`}
          index={index}
          opened={opened}
          setOpened={setOpened}
          handleExpand={handleExpand}
        />
      ))}
    </VStack>
  );
};

export default DirectionsPicker;
