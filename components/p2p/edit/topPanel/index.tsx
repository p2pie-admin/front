import { HStack } from "@chakra-ui/react";
import { IDotColors } from "../../../../types/exchanger";
import { IMaker } from "../../../../types/p2p";
import ExchangerName from "../../../shared/ExchangerNameRating";
import MakerTags from "../../maker/topPanel/MakerTags";
import MakersLinks from "./MakerLinks";
import SaveMaker from "./SaveMaker";
import EditName from "./EditName";
import EditStatus from "./EditStatus";
import { useAppSelector } from "../../../../redux/hooks";

export default function MakerTopPanel({ maker }: { maker: IMaker }) {
  const reduxStatus = useAppSelector((state) => state.main.maker?.status);
  const effectiveStatus = reduxStatus ?? maker.status;
  const statusColor: IDotColors =
    effectiveStatus === "active" ? "green" : "orange";
  const reduxName = useAppSelector((state) => state.main.maker?.telegram_name);
  const displayName =
    reduxName || maker.telegram_name || maker.telegram_username.toUpperCase();

  return (
    <HStack justifyContent="space-between" gap="2" position="relative">
      <ExchangerName
        name={displayName}
        logo={maker.avatar}
        statusColor={statusColor}
      />
      <MakerTags tags={maker.exchanger_tags} />

      <HStack>
        <SaveMaker maker={maker} />
        <EditName maker={maker} />
        <MakersLinks maker={maker} />
        <EditStatus maker={maker} />
      </HStack>
    </HStack>
  );
}
