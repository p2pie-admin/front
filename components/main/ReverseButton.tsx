import {
  useColorModeValue,
  HStack,
  Button,
  Icon,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { ArrowRepeat } from "styled-icons/bootstrap";
import { ChevronThinDown } from "styled-icons/entypo";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { reverseDir } from "../../redux/mainReducer";

const ReverseButton = () => {
  const dispatch = useAppDispatch();
  const [hovered, setHovered] = useState(false);

  const pendingDirTops = useAppSelector((state) => state.main.pendingDirTops);
  const color = useColorModeValue("primary.300", "bg.200");

  const handleReverseDir = () => {
    dispatch(reverseDir());
  };

  return (
    <HStack
      w="80%"
      h="2"
      ml="10%"
      p="0"
      alignItems="center"
      justifyContent="center"
    >
      {/* <Button
        // onClick={!pendingRates ? handleClick : () => {}}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        bgGradient={useColorModeValue(
          "linear(to-b, bg.50, white)",
          "linear(to-b, bg.400, bg.400)"
        )}
        w="12"
        h="12"
        borderRadius="50%"
        m="-1rem !important"
        _hover={{ bgColor }}
        boxShadow={useColorModeValue(
          "0 8px 5px 5px rgba(12,12,12, 0.02),0 -8px 12px 5px rgba(255,255,255,1),inset 0 8px 5px -5px rgb(255,255,255),inset 0 -8px 12px 0 rgb(244,246,247)",
          "none"
        )}
        _focus={{ bgColor }}
        _active={{
          bgColor,
          boxShadow: useColorModeValue(
            "0 -8px 5px 5px rgba(12,12,12, 0.02), 0 8px 12px 5px rgba(255,255,255,1), inset 0 8px 12px 0 rgb(244,246,247)",
            "none"
          ),
        }}
      > */}
      {pendingDirTops ? (
        <Spinner size="sm" color={color} />
      ) : (
        <IconButton
          onClick={handleReverseDir}
          borderRadius="50%"
          variant="primary_regular"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          color="bg.600"
          p="2"
          zIndex="2"
          aria-label="Search database"
          icon={hovered ? <ArrowRepeat /> : <ChevronThinDown />}
        />
      )}
      {/* </Button> */}
    </HStack>
  );
};

export default ReverseButton;
