import { Highlight } from "@chakra-ui/react";
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

  const header =
    activeSide === "give" ? (
      <Highlight
        query="sell"
        styles={{ px: "1", py: "0", rounded: "xl", mx: "2", bg: "pink.200" }}
      >
        {`What do you sell?`}
      </Highlight>
    ) : (
      <Highlight
        query="buy"
        styles={{ px: "1", py: "0", rounded: "xl", mx: "2", bg: "green.200" }}
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
