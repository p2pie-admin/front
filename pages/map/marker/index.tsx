import { Box, Center, Text, Tooltip, useOutsideClick } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { IPhysicalExchanger } from "../../../types/exchanger";
import PhysicalExchangerCard from "./PhysicalExchangerCard";

const CustomMarker = ({
  physicalExchanger,
}: {
  physicalExchanger: IPhysicalExchanger;
}) => {
  const dollars = "$"; //rates % 3 ? "$$$" : rates % 2 ? "$$" : "$";
  const color = "bg.100";
  //rates % 3 ? "orange.200" : rates % 2 ? "yellow.200" : "green.200";
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const ref = useRef();
  useOutsideClick({
    ref,
    handler: () => setActive(false),
  } as any);
  return (
    <Tooltip
      placement="bottom-start"
      isOpen={active || hovered}
      label={<PhysicalExchangerCard physicalExchanger={physicalExchanger} />}
      bgColor="blackAlpha.800"
      borderRadius="lg"
    >
      <Box
        position="relative"
        color={
          !physicalExchanger.opened ? "bg.1000" : hovered ? "bg.10" : color
        }
        cursor="pointer"
        transition="all .1s ease-in"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setActive(true)}
      >
        <FaLocationPin size="2rem" />
        <Center position="absolute" w="8" top="1.5">
          <Text
            color={physicalExchanger.opened ? "bg.1000" : "bg.500"}
            fontSize="xs"
            fontWeight="bold"
          >
            {dollars}
          </Text>
        </Center>
      </Box>
    </Tooltip>
  );
};

export default CustomMarker;
