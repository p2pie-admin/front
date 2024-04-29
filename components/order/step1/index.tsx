import {
  RegularBox,
  ResponsiveText,
  ShadedButton,
} from "../../../styles/theme/custom";
import { AiOutlinePlus } from "react-icons/ai";
import { Box, Button } from "@chakra-ui/react";
import CustomRate from "./customRate";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addEmptyDir } from "../../../redux/mainReducer";
import Intro from "./Intro";
import { useTranslation } from "next-i18next";

const Step1 = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const dirs = useAppSelector((state) => state.main.p2p.dirs);
  const dirsAmount = useAppSelector(
    (state) => state.main.p2p.dirs.filter((dir) => !dir.deleted).length
  );
  const firstDirSelected =
    dirs?.[0]?.give?.[0]?.code && dirs?.[0]?.get?.[0]?.code;

  return (
    <Box>
      <ResponsiveText size="xl" textAlign="center" fontWeight="bold" my="4">
        {t("order:suggest")}
      </ResponsiveText>

      {dirs.map((dir, index) => (
        <CustomRate key={index} dir={dir} index={index} />
      ))}
      <Intro />
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
