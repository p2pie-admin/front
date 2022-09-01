import ResizeObserver from "resize-observer-polyfill";
import { AnimatePresence } from "framer-motion";
import { ToggleLayer } from "react-laag";

import Button from "./Button";
import Menu from "./Menu";
import { Box } from "@chakra-ui/react";

function CircularMenu() {
  return (
    <Box>
      <ToggleLayer
        ResizeObserver={ResizeObserver}
        placement={{
          anchor: "CENTER",
        }}
        renderLayer={({ isOpen, layerProps, close }) => {
          return (
            <AnimatePresence>
              {isOpen && (
                <Menu
                  {...layerProps}
                  close={close}
                  items={[
                    { Icon: "", value: "image", label: "Image" },
                    { Icon: "Video", value: "video", label: "Video" },
                    { Icon: "Music", value: "music", label: "Music" },
                    { Icon: "File", value: "file", label: "File" },
                    { Icon: "Location", value: "location", label: "Location" },
                  ]}
                />
              )}
            </AnimatePresence>
          );
        }}
      >
        {({ triggerRef, toggle, isOpen }) => (
          <Button ref={triggerRef} onClick={toggle} isOpen={isOpen} />
        )}
      </ToggleLayer>
    </Box>
  );
}

export default CircularMenu;
