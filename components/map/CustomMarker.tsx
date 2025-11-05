import { Tooltip, Box, Center, VStack, Text, Divider } from "@chakra-ui/react";
import React, { useMemo, useState, memo } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { IExchanger } from "../../types/exchanger";
import { MarkerTooltipContent } from "./MarkerTooltipContent";
import CustomImage from "../shared/CustomImage";

type CustomMarkerProps = {
  exchanger: IExchanger;
};

const CustomMarker = ({ exchanger }: CustomMarkerProps) => {
  const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { name } = exchanger;

  const isOpen = active || hovered;

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
        transition="all .12s ease-in"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(event) => {
          event.stopPropagation();
          setActive((prev) => !prev);
        }}
      >
        <Box color={isOpen ? "peach.400" : "peach.500"}>
          <FaLocationPin size="2rem" />
          <Center
            top="15%"
            position="absolute"
            left="49%"
            transform="translateX(-50%)"
          >
            {exchanger.logo ? (
              <Box borderRadius="50%" overflow="hidden">
                <CustomImage img={exchanger.logo} w="20px" h="20px" />
              </Box>
            ) : (
              <Box w="8px" h="8px" bg="bg.800" borderRadius="50%" mt="2.5" />
            )}
          </Center>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default memo(CustomMarker);
