import { Highlight, useColorModeValue } from "@chakra-ui/react";

import { useContext } from "react";

import SideContext from "../../../shared/contexts/SideContext";
import CustomModal from "../../../shared/CustomModal";

import Selector from ".";
import { useLocale } from "../../../../services/i18n";

const SelectorModal = ({ id }: { id: string }) => {
  const side = useContext(SideContext) as "give" | "get";
  const primary = useColorModeValue("violet.700", "peach.300");
  const locale = useLocale();

  const header =
    locale === "en" ? (
      <Highlight query={side === "give" ? "selling" : "buying"} styles={{ color: primary }}>
        {side === "give" ? "What are you selling?" : "What are you buying?"}
      </Highlight>
    ) : side === "give" ? (
      <Highlight query="продаете" styles={{ color: primary }}>
        Что вы продаете?
      </Highlight>
    ) : (
      <Highlight query="покупаете" styles={{ color: primary }}>
        Что вы покупаете?
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
