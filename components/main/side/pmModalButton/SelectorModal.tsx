import { Highlight, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setActiveSide } from "../../../../redux/mainReducer";
import { initCMSFetcher } from "../../../../services/fetchers";
import { ISelector } from "../../../../types/selector";
import CustomModal from "../../../shared/CustomModal";

import Selector from "./Selector";
import { selectorQuery } from "./SelectorQuery";

const SelectorModal = () => {
  // const gradient = useColorModeValue(
  //   "linear-gradient(0deg, rgba(241,240,251,1) 10%, rgba(241,240,251,0) 100%);",
  //   "linear-gradient(0deg, rgba(88,79,98,1) 20%, rgba(88,79,98,0) 100%);"
  // );

  // const { i18n } = useTranslation();

  const activeSide = useAppSelector((state) => state.main.activeSide);
  const pink = useColorModeValue("pink.400", "pink.200");
  const green = useColorModeValue("green.400", "green.200");

  const header =
    activeSide === "give" ? (
      <Highlight
        query="sell"
        styles={{ px: "2", py: "1", rounded: "xl", mx: "1", bg: pink }}
      >
        {`What do you sell?`}
      </Highlight>
    ) : (
      <Highlight
        query="buy"
        styles={{ px: "2", py: "1", rounded: "xl", mx: "1", bg: green }}
      >
        {`What do you buy?`}
      </Highlight>
    );
  // const header = activeSide
  //   ? data?.selector[`${i18n.language as "en" | "ru"}_${activeSide}_header`]
  //   : "✓";

  return (
    <CustomModal id={String(activeSide)} header={header}>
      <Selector />
    </CustomModal>
  );
};

export default SelectorModal;
