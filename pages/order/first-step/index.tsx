import {
  RegularBox,
  ResponsiveText,
  ShadedButton,
} from "../../../styles/theme/custom";
import { AiOutlinePlus } from "react-icons/ai";
import { Box, Center, Divider, HStack, Text } from "@chakra-ui/react";
import CustomRate from "./customRate";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addEmptyDir } from "../../../redux/mainReducer";

const SelectCurrency = () => {
  const dispatch = useAppDispatch();
  const dirs = useAppSelector((state) => state.main.p2p.dirs);
  const lastIndex = dirs.length - 1;
  const lastDirSelected =
    dirs[lastIndex].give?.[0]?.code && dirs[lastIndex].get?.[0]?.code;

  return (
    <Box>
      <ResponsiveText variant="contrast" mt="2" mb="4">
        Choose directions:
      </ResponsiveText>

      {dirs.map((_, index) => (
        <>
          <CustomRate key={index} index={index} />
          {/* {index !== dirs.length - 1 && (
            <Box borderRadius="lg" h="1" bgColor="blackAlpha.300" m="2" />
          )} */}
        </>
      ))}

      {lastDirSelected && dirs.length < 9 && (
        <ShadedButton
          display="flex"
          justifyContent="center"
          border="2px dashed"
          borderColor="bg.500"
          onClick={() => dispatch(addEmptyDir())}
          py="2"
          my="4"
        >
          <AiOutlinePlus size="1.5rem" />
        </ShadedButton>
      )}
    </Box>
  );
};

export default SelectCurrency;
