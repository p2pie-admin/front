import { ITEM_SIZE, RADIUS } from "./constants";
import { ToggleLayer, useHover } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";
import React, { useContext, useRef, useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  IconButton,
  Tag,
  Text,
  useColorModeValue,
  useOutsideClick,
} from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import {
  setPm,
  setPopularCompleted,
  triggerModal,
} from "../../../../../redux/mainReducer";
import { IPm, ISide } from "../../../../../types/selector";
import CircularIcon from "../../../../shared/CircularIcon";
import SideContext from "../../../../shared/contexts/SideContext";
import { FiMoreHorizontal } from "react-icons/fi";
import { batch } from "react-redux";
import {
  fetchFiatByCurrencyCode,
  fetchPossiblePairs,
  fetchDirRates,
} from "../../../../../redux/thunks";
import { RegularBox } from "../../../../../styles/theme/wrappers";

/**
 * Positioning Stuff
 */

function getTransform(
  progress: number,
  radius: number,
  index: number,
  totalItems: number,
  side: ISide
) {
  const value = (index / totalItems) * progress;
  // const angleCorrections = [
  //   0,
  //   0.1,
  //   0.25,
  //   0.33,
  //   0.377,
  //   0.402,
  //   0.414,
  //   0.429,
  //   0.438,
  //   0.444,
  // ];
  const r = totalItems < 2 ? 0 : (radius * totalItems) / 5;
  const x = -1 * r * Math.cos(2 * Math.PI * value);
  const y = -1 * r * Math.sin(2 * Math.PI * value);

  const scale = progress / 2 + 0.5;

  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/**
 * MenuItem
 */

////////////////////////////////

function Petal({
  totalItems,
  pm,
  index,
}: {
  totalItems: number;
  pm?: IPm;
  index: number;
}) {
  const side = useContext(SideContext) as "give" | "get";

  const [givePm, getPm] = useAppSelector((state) => [
    state.main.givePm,
    state.main.getPm,
  ]);

  const dispatch = useAppDispatch();

  const choosePm = (selectedPm: IPm) => {
    if (!side) return;
    const oppositePm = side === "give" ? getPm : givePm;
    batch(() => {
      dispatch(
        fetchFiatByCurrencyCode({
          code: selectedPm.currency.code,
          side,
        })
      ); // нужен только код валюты,  reducer сам запишет куда надо
      dispatch(fetchPossiblePairs({ code: selectedPm.code, side: side }));
      dispatch(setPm({ pm: selectedPm, side }));

      if (oppositePm?.code) {
        dispatch(fetchDirRates({ code: selectedPm.code, side: side }));
        dispatch(setPopularCompleted(undefined));
        return;
      }
      dispatch(setPopularCompleted(side));
    });
  };

  const openPmModal = () => {
    dispatch(triggerModal(side));
  };

  return (
    <Center
      pointerEvents="all"
      cursor="pointer"
      key={side + pm?.code}
      as={motion.div}
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 1, opacity: 1 }}
      exit={{ x: 0, opacity: 0 }}
      position="absolute"
      width={`${ITEM_SIZE}px`}
      height={`${ITEM_SIZE}px`}
      transformTemplate={({ x }: { x: number | string }) => {
        const value =
          typeof x === "number" ? x : !x ? 0 : parseFloat(x.replace("px", ""));
        return getTransform(value, RADIUS, index, totalItems, side);
      }}
    >
      {!pm ? (
        <RegularBox
          onClick={() => openPmModal()}
          p="1"
          borderRadius="50%"
          color={useColorModeValue("violet.600", "peach.200")}
          border="1px solid"
          borderColor={useColorModeValue("violet.600", "peach.200")}
        >
          <FiMoreHorizontal size="1rem" />
        </RegularBox>
      ) : (
        <Box onClick={() => choosePm(pm)}>
          <CircularIcon icon={pm.icon} color={pm.color} />
        </Box>
      )}
      {pm?.tag && (
        <Flex
          position="absolute"
          w="8"
          right="-2"
          bottom="0.5"
          justifyContent="center"
        >
          <Box bgColor="bg.900" borderRadius="lg" px="0.5">
            <Text
              fontSize="8"
              color={`${pm.color.split("_")[1] || pm.color}.200`}
              whiteSpace="nowrap"
            >
              {pm.subgroup_name}
            </Text>
          </Box>
        </Flex>
      )}
    </Center>
  );
}

/**
 * Menu
 */
export default Petal;
