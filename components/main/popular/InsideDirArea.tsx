import { Box, useOutsideClick } from "@chakra-ui/react";
import { useRef } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import { setActiveDir } from "../../../redux/mainReducer";

const InsideDirAre = ({ active }: { active: boolean }) => {
  const dispatch = useAppDispatch();
  const ref = useRef();
  useOutsideClick({
    ref: ref,
    handler: () => {
      dispatch(setActiveDir(undefined));
    },
  });
  const radius = active ? 20 : 0;
  return (
    <Box
      w={radius * 2}
      h={radius * 2}
      borderRadius="50%"
      position="absolute"
      top="-70%"
      right="-70%"
    />
  );
};

export default InsideDirAre;
