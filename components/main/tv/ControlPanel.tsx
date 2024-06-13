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
  const secondaryColor = useColorModeValue("bg.100", "bg.800");
  const index = useAppSelector((state) => state.main.swiperIdVisible);
  return (
    <VStack justifyContent="space-between" spacing={["2", "4"]} w="100%">
      <Button
        p={["0.5", "1"]}
        minW={["6", "10"]}
        variant="extra_contrast"
        onClick={() => stepDown()}
        color="bg.500"
      >
        <IoIosArrowUp size="1.2rem" />
      </Button>
      <Box3D w={["6", "10"]} flex="1">
        <VStack
          w="100%"
          spacing={length > 10 ? "1" : length > 20 ? "0.5" : "3"}
          py={["2", "4"]}
          px={["0.5", "2"]}
          h="100%"
          justifyContent={length >= 10 ? "space-around" : "center"}
        >
          {Array.from({ length }).map((_, idx) => (
            <Box
              key={idx}
              transition="background-color 200ms linear"
              bgColor={idx === index ? mainColor : secondaryColor}
              boxShadow={idx === index ? `0 0 10px -2px ${colorKey}` : "unset"}
              borderRadius="sm"
              aspectRatio={["1 / 1", "2 / 1"]}
              h={["2", "3"]}
              maxW={["2", "4"]}
            />
          ))}
        </VStack>
      </Box3D>
      <Button
        p={["0.5", "1"]}
        minW={["6", "10"]}
        variant="extra_contrast"
        onClick={() => stepUp()}
        color="bg.500"
      >
        <IoIosArrowDown size="1.2rem" />
      </Button>
    </VStack>
  );
};

export default ControlPanel;
