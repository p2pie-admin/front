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
import { statusToColor } from "../../../shared/helper";

export default function MakerTopPanel({ maker }: { maker: IMaker }) {
  const reduxStatus = useAppSelector((state) => state.main.maker?.status);
  const effectiveStatus = reduxStatus ?? maker.status;

  const reduxName = useAppSelector((state) => state.main.maker?.telegram_name);
  const displayName =
    reduxName || maker.telegram_name || maker.telegram_username.toUpperCase();

  return (
    <HStack justifyContent="space-between" gap="2" position="relative">
      <HStack gap="2">
        <ExchangerName
          name={displayName}
          logo={maker.avatar}
          statusColor={statusToColor(effectiveStatus)}
        />
        <MakerTags tags={maker.exchanger_tags} />
        <EditName maker={maker} />
      </HStack>

      <HStack gap="2">
        <EditStatus maker={maker} />
        <MakersLinks maker={maker} />
        <SaveMaker maker={maker} />
      </HStack>
    </HStack>
  );
}
