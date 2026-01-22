import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, VStack } from "@chakra-ui/react";
import { IoAddOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {
  addP2PDirection,
  setP2PDirections,
  setP2PFullOffers,
} from "../../../../../redux/mainReducer";
import { IFullOffer } from "../../../../../types/p2p";
import { IPm } from "../../../../../types/selector";
import DirectionItem from "./DirectionItem";

const DirectionsPicker = ({
  offers,
  pms,
}: {
  offers?: IFullOffer[] | null;
  pms?: IPm[] | null;
}) => {
  const dispatch = useAppDispatch();
  const directionsCount = useAppSelector(
    (state) => state.main.p2pDirections.length,
  );
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
  const initialDirections = useMemo(
    () =>
      fullOffers.map(({ givePm, getPm }) => ({
        givePm,
        getPm,
      })),
    [fullOffers],
  );

  useEffect(() => {
    if (!initialDirections.length || directionsCount) return;
    dispatch(setP2PDirections(initialDirections));
  }, [dispatch, directionsCount, initialDirections]);
  useEffect(() => {
    if (!fullOffers.length || fullOffersCount) return;
    dispatch(setP2PFullOffers(fullOffers));
  }, [dispatch, fullOffers, fullOffersCount]);

  const directionIndexes = useMemo(
    () => Array.from({ length: directionsCount }, (_, index) => index),
    [directionsCount],
  );

  return (
    <VStack align="stretch" spacing="3" px="2">
      {!directionsCount ? (
        <Box color="bg.400">
          Добавьте направление, чтобы выбрать методы оплаты.
        </Box>
      ) : (
        <VStack spacing="3" align="stretch">
          {directionIndexes.map((index) => (
            <DirectionItem
              key={`direction-${index}`}
              index={index}
              opened={opened}
              setOpened={setOpened}
              handleExpand={handleExpand}
            />
          ))}
          <Button
            minH="12"
            variant="no_contrast"
            color="peach.500"
            border="2px dashed"
            borderColor="peach.500"
            leftIcon={<IoAddOutline size="1.5rem" />}
            onClick={() => dispatch(addP2PDirection())}
          />
        </VStack>
      )}
    </VStack>
  );
};

export default DirectionsPicker;
