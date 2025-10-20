import {
  useColorModeValue,
  SliderThumb,
  Box,
  useToken,
  Tooltip,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { RxDragHandleDots2 } from "react-icons/rx";
import { curNames, kFormatter } from "../../../redux/amountsHelper";
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
    "peach.400",
    "violet.700",
  ]);

  const colorKey = useColorModeValue(secondary600, primary300);
  const colorHint = useColorModeValue("bg.10", "bg.800");
  const mainColor = useColorModeValue("violet.600", "peach.300");

  // ✅ Fixed: Chakra keyframes with object syntax
  const shake = keyframes({
    from: { transform: "translateY(-5px)" },
    to: { transform: "translateY(0)" },
  });
  const shakeAnimation = `${shake} 1s ease-in-out infinite alternate`;

  const localFormat = (n: number) => {
    const cur = mainCur.toLocaleLowerCase() as keyof typeof curNames;
    return `${curNames?.[cur]?.symbol || ""} ${kFormatter(n)}`;
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      openDelay={500}
      hasArrow
      bg={mainColor}
      color={colorHint}
      placement="left"
      isOpen={showTooltip}
      size="lg"
      fontSize="lg"
      label={localFormat(stickyAmount)}
    >
      <SliderThumb
        boxSize={9}
        bgColor="transparent"
        position="relative"
        boxShadow="none"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setShowTooltip(false)}
        zIndex="10"
      >
        {/* Thumb visual */}
        <Box
          w="5"
          h="4"
          position="relative"
          borderRadius="md"
          bgColor={mainColor}
          boxShadow={`0 0 10px -2px ${colorKey}`}
          color={colorHint}
          as={RxDragHandleDots2}
        />

        {/* Up/Down arrow depending on stickyAmount */}
        <Box
          position="absolute"
          top={stickyAmount <= MAX ? "-6" : "6"}
          left="50%"
          transform="translateX(-50%)"
          color={mainColor}
          zIndex="6"
          animation={shakeAnimation}
        >
          {stickyAmount >= MIN && stickyAmount <= MAX ? null : stickyAmount <=
            MAX ? (
            <BsArrowUpShort size="2rem" />
          ) : (
            <BsArrowDownShort size="2rem" />
          )}
        </Box>
      </SliderThumb>
    </Tooltip>
  );
};

export default Thumb;
