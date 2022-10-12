import {
  useColorModeValue,
  Center,
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
import { batch } from "react-redux";
import { fetchDirTops } from "../../redux/thunks";

const ReverseButton = () => {
  const dispatch = useAppDispatch();
  const [hovered, setHovered] = useState(false);

  const pendingDirTops = useAppSelector((state) => state.main.pendingDirTops);
  const color = useColorModeValue("primary.300", "bg.200");

  const handleReverseDir = () => {
    batch(() => {
      dispatch(reverseDir());
      dispatch(fetchDirTops(null));
    });
  };

  return (
    <Center w="100%" h="2" p="0">
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
        icon={
          pendingDirTops ? (
            <Spinner size="sm" color={color} />
          ) : hovered ? (
            <ArrowRepeat />
          ) : (
            <ChevronThinDown />
          )
        }
      />
    </Center>
  );
};

export default ReverseButton;
