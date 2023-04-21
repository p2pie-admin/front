import styled from "styled-components";
import ResizeObserver from "resize-observer-polyfill";
import {
  ITEM_SIZE,
  RADIUS,
  BORDER,
  TEXT,
  PRIMARY,
  CONTAINER_SIZE,
} from "./constants";
import { ToggleLayer, useHover } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";
import React, { useContext, useState } from "react";
import { Box, Button, Center, Flex, Tag, Text } from "@chakra-ui/react";
import Avatar from "../../../shared/Avatar";
import DirSideContext from "../DirSideContext";
import { IDirGroup, IPmPointer } from "../../../../types/dir";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setActivePetal } from "../../../../redux/mainReducer";
import { IPm, ISide } from "../../../../types/selector";
import { getPmsFromPmGroup } from "../../side/pmModalButton/section/PmGroup/helper";
import CircularIcon from "../../../shared/CircularIcon";

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
  const k = side === "give" ? -1 : 1; // переворачивает угол раскрытия веера, чтобы раскрывалось по бокам
  const value = (index / totalItems) * progress;
  const angleCorrections = [
    0,
    0.1,
    0.25,
    0.33,
    0.377,
    0.402,
    0.414,
    0.429,
    0.438,
    0.444,
  ];
  const r = totalItems < 2 ? 0 : radius + totalItems ** 1.6;
  const x = k * r * Math.cos(Math.PI * (value - angleCorrections[totalItems]));
  const y = k * r * Math.sin(Math.PI * (value - angleCorrections[totalItems]));

  const scale = progress / 2 + 0.5;

  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/**
 * MenuItem
 */

const TooltipBox = styled(motion.div)`
  background-color: #333;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  line-height: 1.15;
  border-radius: 3px;
`;

const Circle = styled(motion.div)`
  position: absolute;
  width: ${ITEM_SIZE}px;
  height: ${ITEM_SIZE}px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 2px 4px 28px 0px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out, border 0.15s ease-in-out;
  pointer-events: all;
  will-change: transform;

  & svg {
    transition: 0.15s ease-in-out;
  }

  &:hover {
    box-shadow: 1px 1px 10px 0px rgba(0, 0, 0, 0.15);
    color: ${PRIMARY};
    & svg {
      transform: scale(1.15);
    }
  }
`;

////////////////////////////////

function Petal({
  totalItems,
  pmPointer,
  index,
}: {
  pmPointer: IPmPointer;
  totalItems: number;
  index: number;
}) {
  const side = useContext(DirSideContext) as "give" | "get";
  const activePetal = useAppSelector((state) => state.main.activePetal);
  const pm = pmPointer.pm_group
    ? getPmsFromPmGroup(pmPointer.pm_group).find(
        (pm) => pm.code === pmPointer.code.toUpperCase()
      )
    : undefined;

  const [givePm, getPm] = useAppSelector((state) => [
    state.main.givePm,
    state.main.getPm,
  ]);

  const dispatch = useAppDispatch();

  if (!pm) return <></>;

  const choosePm = (event: React.FormEvent<EventTarget>) => {
    //const oppositePm = side === "give" ? getPm : givePm;
    //event.stopPropagation(); // работает как закрытие circular menu , если выполняется
    dispatch(setActivePetal({ pm, side }));

    // batch(() => {
    //   dispatch(
    //     fetchFiatByCurrencyCode({
    //       code: pm.currency.code,
    //       side,
    //     })
    //   ); // нужен только код валюты,  reducer сам запишет куда надо
    //   dispatch(fetchPossiblePairs({ code: pm.code, side }));
    //   oppositePm?.code && dispatch(fetchDirRates({ code: pm.code, side }));
    //   oppositePm?.code && dispatch(setActiveDir(undefined));
    //   dispatch(setPm({ pm, side }));
    // });
  };

  return (
    <ToggleLayer
      ResizeObserver={ResizeObserver}
      fixed
      placement={{
        anchor: "TOP_CENTER",
        autoAdjust: true,
        scrollOffset: 16,
        triggerOffset: 6,
      }}
      renderLayer={({ isOpen, layerProps }) => {
        return (
          <AnimatePresence>
            {isOpen && (
              <TooltipBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                {...layerProps}
              >
                {pm.en_name}
              </TooltipBox>
            )}
          </AnimatePresence>
        );
      }}
    >
      {({ triggerRef }) => {
        const shaded =
          activePetal?.side === side && activePetal?.pm.code !== pm.code;
        return (
          <Box
            as={motion.div}
            onClick={choosePm}
            ref={triggerRef}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 1, opacity: 1 }}
            exit={{ x: 0, opacity: 0 }}
            position="absolute"
            width={`${ITEM_SIZE}px`}
            height={`${ITEM_SIZE}px`}
            transformTemplate={({ x }) => {
              const value =
                typeof x === "number"
                  ? x
                  : !x
                  ? 0
                  : parseFloat(x.replace("px", ""));
              return getTransform(value, RADIUS, index, totalItems, side);
            }}

            // transition={{
            //   delay: index * 0.025,
            //   type: "spring",
            //   stiffness: 600,
            //   damping: 50,
            //   mass: 5,
            // }}
          >
            <CircularIcon icon={pm.icon} color={pm.color} />
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
          </Box>
        );
      }}
    </ToggleLayer>
  );
}

/**
 * Menu
 */

const Petals = React.forwardRef(function Menu(
  { style, group }: { group: IDirGroup },
  ref
) {
  return (
    <Center style={style} ref={ref} pointerEvents="none" borderRadius="50%">
      {group.pms.map((pmPointer, index) => (
        <Petal
          key={index}
          pmPointer={pmPointer}
          index={index}
          totalItems={group.pms.length}
        />
      ))}
    </Center>
  );
});

export default Petals;
