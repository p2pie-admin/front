import {
  useColorModeValue,
  Center,
  Button,
  Icon,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiTransferAlt } from "react-icons/bi";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { reverseDir } from "../../redux/mainReducer";
import { batch } from "react-redux";
import { fetchDirTops } from "../../redux/thunks";

const ReverseButton = () => {
  const dispatch = useAppDispatch();

  const pendingDirTops = useAppSelector((state) => state.main.pendingDirTops);
  const color = useColorModeValue("primary.300", "bg.200");

  const handleReverseDir = () => {
    batch(() => {
      dispatch(reverseDir());
      dispatch(fetchDirTops({}));
    });
  };

  return (
    <Center w="100%" h="2" p="0">
      <IconButton
        onClick={handleReverseDir}
        borderRadius="50%"
        variant="primary_regular"
        color="bg.600"
        zIndex="2"
        aria-label="Reverse direction"
        icon={
          pendingDirTops ? (
            <Spinner size="sm" color={color} />
          ) : (
            <BiTransferAlt />
          )
        }
      />
    </Center>
  );
};

export default ReverseButton;
