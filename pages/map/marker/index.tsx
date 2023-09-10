import {
  Box,
  Center,
  Text,
  Tooltip,
  color,
  useOutsideClick,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaLocationPin } from "react-icons/fa6";
import { IPhysicalExchanger } from "../../../types/exchanger";
import PhysicalExchangerCard from "./PhysicalExchangerCard";
import { getDollars } from "../helper";

const CustomMarker = ({
  physicalExchanger,
  priceBasis,
}: {
  physicalExchanger: IPhysicalExchanger;
  priceBasis: [number, number];
}) => {
  //rates % 3 ? "$$$" : rates % 2 ? "$$" : "$";

  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const dollars = getDollars(priceBasis, physicalExchanger);

  const dollarSigns = Array(dollars).fill("$").join("");
  const colors = !dollars
    ? ["bg.1000", "bg.500"]
    : active || hovered
    ? ["white", "bg.800"]
    : dollars === 3
    ? ["orange.200", "orange.700"]
    : dollars === 2
    ? ["yellow.200", "yellow.700"]
    : ["green.200", "green.700"];

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
        p="1"
        color={colors[0]}
        cursor="pointer"
        transition="all .1s ease-in"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => {
          setActive(!active);
          e.stopPropagation();
        }}
      >
        <Box position="absolute" right="-3" top="-7">
          <FaLocationPin size="2rem" />
          <Center position="absolute" w="8" top="1.5">
            <Text color={colors[1]} fontSize="xs" fontWeight="bold">
              {dollarSigns || "zZ"}
            </Text>
          </Center>
        </Box>
      </Box>
    </Tooltip>
  );
};

export default CustomMarker;
