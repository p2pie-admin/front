import { Highlight, useColorModeValue } from "@chakra-ui/react";

import { useContext } from "react";

import SideContext from "../../../shared/contexts/SideContext";
import CustomModal from "../../../shared/CustomModal";

import Selector from ".";

const SelectorModal = ({ id }: { id: string }) => {
  const side = useContext(SideContext) as "give" | "get";
  const primary = useColorModeValue("violet.700", "peach.300");

  const header =
    side === "give" ? (
      <Highlight query="sell" styles={{ color: primary }}>
        {`What do you sell?`}
      </Highlight>
    ) : (
      <Highlight query="buy" styles={{ color: primary }}>
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
