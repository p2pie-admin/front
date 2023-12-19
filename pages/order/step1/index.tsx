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

const Step1 = () => {
  const dispatch = useAppDispatch();
  const dirs = useAppSelector((state) => state.main.p2p.dirs);
  const lastIndex = dirs.length - 1;
  const lastDirSelected =
    dirs?.[lastIndex]?.give?.[0]?.code && dirs?.[lastIndex]?.get?.[0]?.code;

  return (
    <Box>
      <ResponsiveText variant="contrast" mt="1">
        Choose exchange directions:
      </ResponsiveText>

      {dirs.map((dir, index) => (
        <CustomRate dir={dir} index={index} />
      ))}

      {lastDirSelected && dirs.length < 3 && (
        <ShadedButton
          display="flex"
          justifyContent="center"
          border="2px dashed"
          borderColor="bg.500"
          onClick={() => dispatch(addEmptyDir())}
          py="4"
          mt="2"
        >
          <AiOutlinePlus size="1.6rem" />
        </ShadedButton>
      )}
    </Box>
  );
};

export default Step1;
