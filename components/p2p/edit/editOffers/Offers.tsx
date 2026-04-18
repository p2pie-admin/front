import React, { useState, useEffect, useRef, useMemo } from "react";
import { VStack } from "@chakra-ui/react";
import { useAppSelector } from "../../../../redux/hooks";
import Offer from "./offer";
import { IFullOffer } from "../../../../types/p2p";

const DirectionsPicker = ({
  offers,
  addDirectionSignal = 0,
}: {
  offers?: Partial<IFullOffer>[] | null;
  addDirectionSignal?: number;
}) => {
  const fullOffersCount = useAppSelector(
    (state) => state.main.p2pFullOffers.length,
  );
  const [opened, setOpened] = useState(1000);
  const shouldAutoScrollRef = useRef(false);
  const prevAddDirectionSignalRef = useRef(addDirectionSignal);

  const handleExpand = (event: any, index: number) => {
    if (index !== opened) return;
    event.preventDefault();
    event.stopPropagation();
    shouldAutoScrollRef.current = true;
    setOpened(index);
  };

  const handleToggleOpened = (index: number) => {
    shouldAutoScrollRef.current = true;
    setOpened((current) => (index === current ? 1000 : index));
  };

  const prevOpenedRef = useRef(opened);
  useEffect(() => {
    const prevOpened = prevOpenedRef.current;
    prevOpenedRef.current = opened;
    if (!shouldAutoScrollRef.current) {
      return;
    }
    shouldAutoScrollRef.current = false;
    if (prevOpened === opened) return;
    if (prevOpened === 1000 || opened === 1000) return;
    const timer = window.setTimeout(() => {
      const target = document.getElementById(`direction-item-${opened}`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [opened]);

  const fallbackOffers = useMemo(() => offers || [], [offers]);
  const renderCount = Math.max(fullOffersCount, fallbackOffers.length);
  const directionIndexes = useMemo(
    () => Array.from({ length: renderCount }, (_, index) => index),
    [renderCount],
  );

  useEffect(() => {
    const prevSignal = prevAddDirectionSignalRef.current;
    prevAddDirectionSignalRef.current = addDirectionSignal;
    if (addDirectionSignal === prevSignal) {
      return;
    }
    shouldAutoScrollRef.current = true;
    setOpened(renderCount - 1);
  }, [addDirectionSignal, renderCount]);

  return (
    <VStack align="stretch" spacing="6" px={{ base: 0, lg: 2 }}>
      {directionIndexes.map((index) => (
        <Offer
          key={`direction-${index}`}
          index={index}
          opened={opened}
          setOpened={handleToggleOpened}
          handleExpand={handleExpand}
          initialOffer={fallbackOffers[index]}
        />
      ))}
    </VStack>
  );
};

export default DirectionsPicker;
