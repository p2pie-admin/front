import {
  useColorModeValue,
  SliderThumb,
  Box,
  useToken,
  keyframes,
  Tooltip,
} from "@chakra-ui/react";

import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";
import { RxDragHandleDots2 } from "react-icons/rx";
import { ResponsiveText } from "../../../styles/theme/custom";
import { symbols, kFormatter } from "../../../redux/amountsHelper";
import { useState } from "react";

const Thumb = ({
  mainCur,
  MIN,
  MAX,
  stickyAmount,
}: {
  mainCur: string;
  MIN: number;
  MAX: number;
  stickyAmount: number;
}) => {
  const [primary300, secondary600] = useToken("colors", [
    "peach.300",
    "violet.600",
  ]);

  const colorKey = useColorModeValue(secondary600, primary300);
  const colorHint = useColorModeValue("bg.10", "bg.800");
  const mainColor = useColorModeValue("violet.500", "peach.200");

  const shake = keyframes`
  from {transform: translateX(-5px)}
  to {transform: translateX(0)}
  `;
  const shakeAnimation = `${shake} infinite 1s ease-in-out alternate`;

  const localFormat = (n: number) => {
    const cur = mainCur.toLocaleLowerCase() as keyof typeof symbols;
    return `${symbols[cur] || ""} ${kFormatter(n)}`;
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      hasArrow
      bg={colorHint}
      color={mainColor}
      placement="top"
      isOpen={showTooltip}
      label={localFormat(stickyAmount)}
    >
      <SliderThumb
        boxSize={9}
        bgColor="transparent"
        position="relative"
        boxShadow="none"
        top="4"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setShowTooltip(false)}
        zIndex="10"
      >
        <Box
          w="4"
          h="5"
          position="relative"
          borderRadius="md"
          bgColor={mainColor}
          boxShadow={`0 0 10px -2px ${colorKey}`}
          color={colorHint}
          as={RxDragHandleDots2}
          transform="rotate(90deg)"
        />

        <Box
          position="absolute"
          color={mainColor}
          right={stickyAmount <= MAX ? "-5" : "6"}
          zIndex="6"
          animation={shakeAnimation}
        >
          {stickyAmount >= MIN && stickyAmount <= MAX ? (
            <></>
          ) : stickyAmount <= MAX ? (
            <BsArrowRightShort size="2rem" />
          ) : (
            <BsArrowLeftShort size="2rem" />
          )}
        </Box>
      </SliderThumb>
    </Tooltip>
  );
};

export default Thumb;
