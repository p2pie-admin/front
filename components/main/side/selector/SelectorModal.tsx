import { Highlight, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useContext } from "react";
import useSWR from "swr";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { initCMSFetcher } from "../../../../services/fetchers";
import { ISelector } from "../../../../types/selector";
import P2PContext from "../../../shared/contexts/p2pContext";
import SideContext from "../../../shared/contexts/SideContext";
import CustomModal from "../../../shared/CustomModal";

import Selector from ".";
import { selectorQuery } from "./SelectorQuery";

const SelectorModal = ({ id }: { id: string }) => {
  const side = useContext(SideContext) as "give" | "get";
  const pink = useColorModeValue("pink.400", "pink.200");
  const green = useColorModeValue("green.400", "green.200");

  const header =
    side === "give" ? (
      <Highlight query="sell" styles={{ color: pink }}>
        {`What do you sell?`}
      </Highlight>
    ) : (
      <Highlight query="buy" styles={{ color: green }}>
        {`What do you buy?`}
      </Highlight>
    );
  // const header = activeSide
  //   ? data?.selector[`${i18n.language as "en" | "ru"}_${activeSide}_header`]
  //   : "✓";

  return (
    <CustomModal id={id} header={header}>
      <Selector />
    </CustomModal>
  );
};

export default SelectorModal;
