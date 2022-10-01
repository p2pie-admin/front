import ResizeObserver from "resize-observer-polyfill";
import { AnimatePresence } from "framer-motion";
import { ToggleLayer } from "react-laag";

import Button from "./PmButton";
import Menu from "./Menu";
import { Box } from "@chakra-ui/react";
import { useAppSelector } from "../../../../redux/hooks";
import { IDirGroup } from "../../../../types/dir";

function DirSide({ dirId, group }: { dirId: string; group: IDirGroup }) {
  const activeDir = useAppSelector((state) => state.main.activeDir);

  return (
    <Box>
      <ToggleLayer
        isOpen={activeDir === dirId}
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

export default DirSide;
