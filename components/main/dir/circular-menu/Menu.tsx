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
import { Box, Button, Flex, Tag, Text } from "@chakra-ui/react";
import Icon from "../../../shared/Avatar";
import DirSideContext from "../DirSideContext";
import { IDirGroup } from "../../../../types/dir";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setActiveSide, setPm } from "../../../../redux/mainReducer";
import { PmType, Side } from "../../../../types/selector";
import { batch } from "react-redux";
import {
  fetchFiatByCurrencyCode,
  fetchPossiblePairs,
  fetchDirTops,
} from "../../../../redux/thunks";

/**
 * Positioning Stuff
 */

function getTransform(
  progress: number,
  radius: number,
  index: number,
  totalItems: number,
  side: Side
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

function MenuItem({
  index,
  totalItems,
  pm,
}: {
  pm: PmType;
  index: number;
  totalItems: number;
}) {
  const side = useContext(DirSideContext) as "give" | "get";
  const activeSide = useAppSelector((state) => state.main.activeSide);

  const [givePm, getPm] = useAppSelector((state) => [
    state.main.givePm,
    state.main.getPm,
  ]);

  const dispatch = useAppDispatch();

  const choosePm = () => {
    const oppositePm = activeSide === "give" ? getPm : givePm;

    batch(() => {
      dispatch(
        fetchFiatByCurrencyCode({
          code: pm.currency.code,
          side,
        })
      ); // нужен только код валюты,  reducer сам запишет куда надо
      dispatch(fetchPossiblePairs({ code: pm.code, side }));
      oppositePm?.code && dispatch(fetchDirTops(pm.code));
      dispatch(setPm({ pm, side }));
    });
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
                {label}
              </TooltipBox>
            )}
          </AnimatePresence>
        );
      }}
    >
      {({ triggerRef }) => {
        const dispatch = useAppDispatch();

        return (
          <Circle
            onClick={choosePm}
            ref={triggerRef}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 1, opacity: 1 }}
            exit={{ x: 0, opacity: 0 }}
            transformTemplate={({ x }) => {
              const value =
                typeof x === "number"
                  ? x
                  : !x
                  ? 0
                  : parseFloat(x.replace("px", ""));
              return getTransform(value, RADIUS, index, totalItems, side);
            }}
            transition={{
              delay: index * 0.025,
              type: "spring",
              stiffness: 600,
              damping: 50,
              mass: 5,
            }}
          >
            <Icon icon={pm.icon} />
            <Flex
              position="absolute"
              w="8"
              right="-4"
              bottom="-1"
              justifyContent="center"
            >
              <Box bgColor="bg.700" borderRadius="lg" px="1">
                <Text fontSize="11px">{pm.tag}</Text>
              </Box>
            </Flex>
          </Circle>
        );
      }}
    </ToggleLayer>
  );
}

/**
 * Menu
 */

const MenuBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${CONTAINER_SIZE}px;
  height: ${CONTAINER_SIZE}px;
  pointer-events: none;
  border-radius: 50%;
`;

const Menu = React.forwardRef(function Menu(
  { style, group }: { group: IDirGroup },
  ref
) {
  return (
    <MenuBase ref={ref} style={style}>
      {group.pms.map((pm, index) => (
        <MenuItem
          key={index}
          pm={pm}
          index={index}
          totalItems={group.pms.length}
        />
      ))}
    </MenuBase>
  );
});

export default Menu;
