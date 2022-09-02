import ResizeObserver from "resize-observer-polyfill";
import { AnimatePresence } from "framer-motion";
import { ToggleLayer } from "react-laag";

import Button from "./Button";
import Menu from "./Menu";
import { Box } from "@chakra-ui/react";
import { setActivePopular } from "../../../../redux/mainReducer";
import { useAppSelector } from "../../../../redux/hooks";
import { IPopular, IPopularGroup } from "../../../../types/popular";

function CircularMenu({
  dirId,
  group,
}: {
  dirId: string;
  group: IPopularGroup;
}) {
  const activePopular = useAppSelector((state) => state.main.activePopular);

  return (
    <Box>
      <ToggleLayer
        isOpen={activePopular === dirId}
        ResizeObserver={ResizeObserver}
        placement={{
          anchor: "CENTER",
        }}
        renderLayer={({ isOpen, layerProps }) => {
          return (
            <AnimatePresence>
              {isOpen && <Menu {...layerProps} group={group} />}
            </AnimatePresence>
          );
        }}
      >
        {({ triggerRef }) => <Button ref={triggerRef} group={group} />}
      </ToggleLayer>
    </Box>
  );
}

export default CircularMenu;
