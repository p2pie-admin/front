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
  useOutsideClick,
} from "@chakra-ui/react";
import Avatar from "../../../../shared/Avatar";

import { IDirGroup, IPmPointer } from "../../../../../types/dir";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { setActiveDir, setActivePetal } from "../../../../../redux/mainReducer";
import { IPm, ISide } from "../../../../../types/selector";
import { getPmsFromPmGroup } from "../../../side/pmModalButton/section/PmGroup/helper";
import CircularIcon from "../../../../shared/CircularIcon";
import { group, log } from "console";
import SideContext from "../../../../shared/SideContext";
import { FiMoreHorizontal } from "react-icons/fi";

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
  const r = totalItems < 2 ? 0 : radius * 1.5;
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
  const activePetal = useAppSelector((state) => state.main.activePetal);

  const [givePm, getPm] = useAppSelector((state) => [
    state.main.givePm,
    state.main.getPm,
  ]);

  const dispatch = useAppDispatch();

  const choosePm = (event: React.FormEvent<EventTarget>) => {
    console.log(pm?.code);
    // const oppositePm = side === "give" ? getPm : givePm;
    // event.stopPropagation(); // работает как закрытие circular menu , если выполняется
    // dispatch(setActivePetal({ pm, side }));
  };

  return (
    <Center
      as={motion.div}
      // _after={{
      //   content: "''",
      //   bgColor: "red.500",
      //   left: "0",
      //   position: "absolute",
      //   borderRadius: "inherit",
      //   w: "100%",
      //   h: "100%",
      //   zIndex: "23",
      //   cursor: "pointer",
      // }}
      onClick={choosePm}
      pointerEvents="all"
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 1, opacity: 1 }}
      exit={{ x: 0, opacity: 0 }}
      position="absolute"
      width={`${ITEM_SIZE}px`}
      height={`${ITEM_SIZE}px`}
      transformTemplate={({ x }) => {
        const value =
          typeof x === "number" ? x : !x ? 0 : parseFloat(x.replace("px", ""));
        return getTransform(value, RADIUS, index, totalItems, side);
      }}
    >
      {!pm ? (
        <Box
          bgColor="bg.700"
          p="1"
          borderRadius="50%"
          color="primary.200"
          border="1px solid"
          borderColor="primary.200"
        >
          <FiMoreHorizontal size="1rem" />
        </Box>
      ) : (
        <CircularIcon icon={pm.icon} color={pm.color} />
      )}
      {pm?.tag && (
        <Flex
          position="absolute"
          w="8"
          right="-2"
          bottom="-1"
          justifyContent="center"
        >
          <Box bgColor="bg.900" borderRadius="lg" px="0.5">
            <Text
              fontSize="9px"
              color={`${pm.color.split("_")[1] || pm.color}.200`}
            >
              {pm.tag}
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
