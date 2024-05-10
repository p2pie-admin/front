import {
  VStack,
  Button,
  Box,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";

import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Box3D } from "../../../../styles/theme/custom";
import { useAppSelector } from "../../../../redux/hooks";

const ControlPanel = ({
  stepUp,
  stepDown,
  length,
}: {
  stepUp: any;
  stepDown: any;
  length: number;
}) => {
  const [peach300, violet600] = useToken("colors", ["peach.300", "violet.600"]);
  const colorKey = useColorModeValue(violet600, peach300);
  const mainColor = useColorModeValue("violet.600", "peach.200");
  const index = useAppSelector((state) => state.main.swiperIdVisible);
  return (
    <VStack justifyContent="space-between" spacing={["2", "4"]}>
      <Button p="1" variant="contrast" onClick={() => stepDown()}>
        <IoIosArrowUp size="1.2rem" />
      </Button>
      <Box3D h="100%" w="100%">
        <VStack
          spacing={length > 10 ? "1" : length > 20 ? "0.5" : "2"}
          p={["2", "4"]}
          h="100%"
          justifyContent="space-around"
        >
          {Array.from({ length }).map((_, idx) => (
            <Box
              key={idx}
              transition="background-color 200ms linear"
              bgColor={idx === index ? mainColor : "bg.800"}
              boxShadow={idx === index ? `0 0 10px -2px ${colorKey}` : "unset"}
              borderRadius="sm"
              aspectRatio="2 / 1"
              h="100%"
              maxH="4"
              maxW="5"
            />
          ))}
        </VStack>
      </Box3D>
      <Button p="1" variant="contrast" onClick={() => stepUp()}>
        <IoIosArrowDown size="1.2rem" />
      </Button>
    </VStack>
  );
};

export default ControlPanel;
