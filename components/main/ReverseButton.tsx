import {
  useColorModeValue,
  Center,
  Button,
  Icon,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiRefresh } from "react-icons/bi";
import { IoChevronDownOutline } from "react-icons/io5";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { reverseDir } from "../../redux/mainReducer";
import { batch } from "react-redux";
import { fetchDirTops } from "../../redux/thunks";

const ReverseButton = () => {
  const dispatch = useAppDispatch();

  const pendingDirTops = useAppSelector((state) => state.main.pendingDirTops);
  const bothPmsSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );

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
        isLoading={pendingDirTops}
        aria-label="Reverse direction"
        icon={
          bothPmsSelected ? (
            <BiRefresh size="2rem" />
          ) : (
            <IoChevronDownOutline size="2rem" />
          )
        }
      />
    </Center>
  );
};

export default ReverseButton;
