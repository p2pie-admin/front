import React, { useMemo, useState, useEffect } from "react";
import { Box, Button, Collapse, Grid, HStack, VStack } from "@chakra-ui/react";
import { IoAddOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {
  addP2PDirection,
  setP2PDirections,
} from "../../../../../redux/mainReducer";
import { Box3D, ResponsiveText } from "../../../../../styles/theme/custom";
import DirectionPmButton from "./directionPmButton";
import { BsArrowRightShort } from "react-icons/bs";
import { TbExternalLink } from "react-icons/tb";
import NavButton from "../../../../layout/nav/NavButton";
import { RxCross2 } from "react-icons/rx";
import { FiEdit2 } from "react-icons/fi";
import { IFullOffer } from "../../../../../types/p2p";
import { IPm } from "../../../../../types/selector";
import DirectionDetails from "./details";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";

const DirectionsPicker = ({
  offers,
  pms,
}: {
  offers?: IFullOffer[] | null;
  pms?: IPm[] | null;
}) => {
  const dispatch = useAppDispatch();
  const directions = useAppSelector((state) => state.main.p2pDirections);
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
    if (!initialDirections.length || directions.length) return;
    dispatch(setP2PDirections(initialDirections));
  }, [dispatch, directions.length, initialDirections]);

  return (
    <VStack align="stretch" spacing="3" px="2">
      {!directions.length ? (
        <Box color="bg.400">
          Добавьте направление, чтобы выбрать методы оплаты.
        </Box>
      ) : (
        <VStack spacing="3" align="stretch">
          {directions.map((direction, index) => (
            <Box3D
              key={`${direction.givePm?.code ?? "give"}-${direction.getPm?.code ?? "get"}-${index}`}
              w="100%"
              flex="1"
              px="4"
              py="2"
              cursor="pointer"
              display="block"
              alignSelf="stretch"
              transition="filter 0.2s ease-in"
              _hover={{ filter: "brightness(1.1)" }}
              variant="extra_contrast"
              onClick={() => setOpened(index == opened ? 1000 : index)}
              //minH={fullHeight ? "70px" : "unset"}
            >
              <Grid
                gridTemplateColumns={"2fr 40px 2fr 1fr"}
                gridTemplateRows="auto"
                color="bg.500"
                alignItems="center"
                columnGap="2"
              >
                <DirectionPmButton
                  side="give"
                  directionIndex={index}
                  pm={direction.givePm}
                  handleExpand={handleExpand}
                />

                <BsArrowRightShort size="1.5rem" />

                <DirectionPmButton
                  side="get"
                  directionIndex={index}
                  pm={direction.getPm}
                  handleExpand={handleExpand}
                />
                <HStack justifySelf="end">
                  <Button variant="ghost">
                    {index == opened ? (
                      <MdOutlineKeyboardArrowUp size="1.5rem" />
                    ) : (
                      <MdOutlineKeyboardArrowDown size="1.5rem" />
                    )}
                  </Button>
                </HStack>
              </Grid>
              <Collapse in={index == opened}>
                <DirectionDetails fullOffer={fullOffers[index]} />
              </Collapse>
            </Box3D>
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
