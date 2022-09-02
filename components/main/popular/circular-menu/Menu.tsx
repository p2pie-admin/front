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
import { Button } from "@chakra-ui/react";
import Icon from "../../../shared/Icon";
import PopularSideContext from "../PopularSideContext";
import { IPM, IPopularGroup } from "../../../../types/popular";
import PmButton from "../../side/pmModalButton/section/PmGroup/PmButton";

/**
 * Positioning Stuff
 */

function getTransform(progress, radius, index, totalItems, side) {
  const k = side === "give" ? -1 : 1; // переворачивает угол раскрытия веера, чтобы раскрывалось по бокам
  const value = (index / totalItems) * progress;

  const x = k * radius * Math.cos(Math.PI * (value - 0.34));
  const y = k * radius * Math.sin(Math.PI * (value - 0.34));

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
  border: 1px solid ${BORDER};
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

function MenuItem({ style, index, totalItems, pm }: { pm: IPM }) {
  const side = useContext(PopularSideContext) as "give" | "get";
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
        return (
          <Circle
            ref={triggerRef}
            style={style}
            initial={{ x: 0, opacity: 0 }}
            animate={{ x: 1, opacity: 1 }}
            exit={{ x: 0, opacity: 0 }}
            transformTemplate={({ x }) => {
              const value = parseFloat(x.replace("px", ""));
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
  { style, group }: { group: IPopularGroup },
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
