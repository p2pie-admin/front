import {
  useColorModeValue,
  SliderThumb,
  Box,
  useToken,
  keyframes,
} from "@chakra-ui/react";

import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";
import { RxDragHandleDots2 } from "react-icons/rx";
import { ResponsiveText } from "../../../styles/theme/custom";
import { symbols, kFormatter } from "../../../redux/amountsHelper";

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
  const color1 = useColorModeValue("bg.200", "bg.800");
  const color2 = useColorModeValue("bg.10", "bg.900");
  const color3 = useColorModeValue("bg.100", "bg.800");
  const mainColor = useColorModeValue("violet.600", "peach.200");

  const shake = keyframes`
  from {transform: translateX(-5px)}
  to {transform: translateX(0)}
  `;
  const shakeAnimation = `${shake} infinite 1s ease-in-out alternate`;

  const localFormat = (n: number) => {
    const cur = mainCur.toLocaleLowerCase() as keyof typeof symbols;
    return `${symbols[cur] || ""} ${kFormatter(n)}`;
  };

  return (
    <SliderThumb
      boxSize={8}
      bgColor="transparent"
      position="relative"
      boxShadow="none"
    >
      <Box
        w="5"
        h="3"
        position="relative"
        borderRadius="md"
        bgColor={mainColor}
        boxShadow={`0 0 10px -2px ${colorKey}`}
        color={color3}
        as={RxDragHandleDots2}
      />
      <ResponsiveText
        size="xs"
        position="absolute"
        top="-12px"
        color={mainColor}
        whiteSpace="nowrap"
      >
        {localFormat(stickyAmount)}
      </ResponsiveText>
      <Box
        position="absolute"
        color={mainColor}
        right={stickyAmount <= MAX ? "-5" : "6"}
        zIndex="5"
        animation={shakeAnimation}
      >
        {stickyAmount >= MIN && stickyAmount <= MAX ? (
          <></>
        ) : stickyAmount <= MAX ? (
          <BsArrowRightShort size="1.5rem" />
        ) : (
          <BsArrowLeftShort size="1.5rem" />
        )}
      </Box>
    </SliderThumb>
  );
};

export default Thumb;
