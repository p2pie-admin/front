import {
  RegularBox,
  ResponsiveText,
  ShadedButton,
} from "../../../styles/theme/custom";
import { AiOutlinePlus } from "react-icons/ai";
import { Box } from "@chakra-ui/react";
import CustomRate from "./customRate";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addEmptyDir } from "../../../redux/mainReducer";

const Step1 = () => {
  const dispatch = useAppDispatch();
  const dirs = useAppSelector((state) => state.main.p2p.dirs);
  const dirsAmount = useAppSelector(
    (state) => state.main.p2p.dirs.filter((dir) => !dir.deleted).length
  );
  const firstDirSelected =
    dirs?.[0]?.give?.[0]?.code && dirs?.[0]?.get?.[0]?.code;

  return (
    <Box>
      <ResponsiveText>Publish your own rates</ResponsiveText>

      <ResponsiveText size="xs" whiteSpace="normal">
        Make it once and your rates will automatically follow the market. Or fix
        them if you wish. Use deposit or rating to increase client's trust for
        online exchange. Or choose options for meeting in real life.
      </ResponsiveText>

      {dirs.map((dir, index) => (
        <CustomRate dir={dir} index={index} />
      ))}

      {firstDirSelected && dirsAmount < 3 && (
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
