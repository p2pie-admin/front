import { Tooltip, Box, Center } from "@chakra-ui/react";
import React, { useState, memo } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { IExchanger } from "../../types/exchanger";
import { MarkerTooltipContent } from "./MarkerTooltipContent";
import CustomImage from "../shared/CustomImage";

type CustomMarkerProps = {
  id: string;
  exchanger: IExchanger;
  highlighted?: boolean;
  activeMarkerId?: string | null;
  setActiveMarkerId?: (id: string | null) => void;
};

const CustomMarker = ({
  id,
  exchanger,
  highlighted = false,
  activeMarkerId,
  setActiveMarkerId,
}: CustomMarkerProps) => {
  const [localActive, setLocalActive] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isActive =
    activeMarkerId !== undefined ? activeMarkerId === id : localActive;
  const isOpen = isActive || hovered;
  const pinColor = highlighted ? "peach.300" : isOpen ? "red.300" : "red.400";

  return (
    <Tooltip
      openDelay={500}
      placement="bottom-start"
      isOpen={isOpen}
      bgColor="bg.900"
      borderRadius="lg"
      dropShadow="lg"
      label={<MarkerTooltipContent exchanger={exchanger} />}
    >
      <Box
        position="relative"
        w="10"
        h="10"
        p="1"
        cursor="pointer"
        transition="transform .12s ease-in, filter .12s ease-in"
        transform={highlighted ? "scale(1.1)" : "scale(1)"}
        filter={
          highlighted ? "drop-shadow(0 0 8px rgba(200, 144, 109, 0.8))" : "none"
        }
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          const next = !isActive;
          if (setActiveMarkerId) {
            setActiveMarkerId(next ? id : null);
          } else {
            setLocalActive(next);
          }
        }}
        onBlur={() => {
          if (setActiveMarkerId) setActiveMarkerId(null);
          else setLocalActive(false);
        }}
      >
        <Box bottom="8" left="-4" color={pinColor} position="absolute">
          <FaLocationPin size="3rem" />
        </Box>

        <Center
          transform="translateX(-50%)"
          bottom="46px"
          left="20%"
          position="absolute"
        >
          {exchanger.logo ? (
            <Box borderRadius="50%" overflow="hidden">
              <CustomImage img={exchanger.logo} w="30px" h="30px" />
            </Box>
          ) : (
            <Box w="8px" h="8px" bg="bg.800" borderRadius="50%" mt="2.5" />
          )}
        </Center>
      </Box>
    </Tooltip>
  );
};

export default memo(CustomMarker);
