import {
  VStack,
  Button,
  Box,
  useColorModeValue,
  useToken,
} from "@chakra-ui/react";

import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { Box3D } from "../../../styles/theme/custom";
import { useAppSelector } from "../../../redux/hooks";

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
      <Button
        p={["0.5", "1"]}
        minW={["6", "10"]}
        variant="contrast"
        onClick={() => stepDown()}
        color="whiteAlpha.500"
      >
        <IoIosArrowUp size="1rem" />
      </Button>
      <Box3D h="100%" w={["6", "10"]}>
        <VStack
          w="100%"
          spacing={length > 10 ? "1" : length > 20 ? "0.5" : "2"}
          py={["1", "2"]}
          px={["0.5", "2"]}
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
              aspectRatio={["1 / 1", "2 / 1"]}
              h="100%"
              maxH={["2", "3"]}
              maxW={["2", "4"]}
            />
          ))}
        </VStack>
      </Box3D>
      <Button
        p={["0.5", "1"]}
        minW={["6", "10"]}
        variant="contrast"
        onClick={() => stepUp()}
        color="whiteAlpha.500"
      >
        <IoIosArrowDown size="1rem" />
      </Button>
    </VStack>
  );
};

export default ControlPanel;
