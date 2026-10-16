import { Box, HStack } from "@chakra-ui/react";
import { IDotColors } from "../../../../types/exchanger";
import { IMaker } from "../../../../types/p2p";
import ExchangerName from "../../../shared/ExchangerNameRating";
import MakerTags from "./MakerTags";
import Actions from "../../../exchangers/exchanger/exchangerTopPanel/Actions";
import OwnerEdit from "./OwnerEdit";
import MakerTopButtons from "./MakerTopButtons";
const MakerTopPanel = ({ maker }: { maker: IMaker }) => {
  const statusColor: IDotColors =
    maker.status === "active" ? "green" : "orange";
  const displayName = maker.telegram_name || maker.slug;

  return (
    <HStack justifyContent="space-between" gap="2" position="relative">
      <ExchangerName
        name={displayName}
        logo={maker.avatar}
        statusColor={statusColor}
        isH1
      />
      <OwnerEdit maker={maker} />

      <MakerTags tags={maker.exchanger_tags} />
      <Actions id={maker.id} displayName={displayName} />
      <Box display={{ base: "none", lg: "flex" }} flexDir="row" gap="2">
        <MakerTopButtons />
      </Box>
    </HStack>
  );
};

export default MakerTopPanel;
