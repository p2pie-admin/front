import { HStack } from "@chakra-ui/react";
import ExchangerName from "../../../shared/ExchangerNameRating";
import MakerTags from "../../maker/topPanel/MakerTags";
import MakersLinks from "./MakerLinks";
import SaveMaker from "./SaveMaker";
import EditName from "./EditName";
import EditStatus from "./EditStatus";
import { useAppSelector } from "../../../../redux/hooks";
import { statusToColor } from "../../../shared/helper";
import { useMakerEditContext } from "../MakerEditContext";

export default function MakerTopPanel() {
  const maker = useMakerEditContext();
  const reduxStatus = useAppSelector((state) => state.main.maker?.status);
  const effectiveStatus = reduxStatus ?? maker.status;

  const reduxName = useAppSelector((state) => state.main.maker?.telegram_name);
  const displayName =
    reduxName || maker.telegram_name || maker.telegram_username.toUpperCase();

  return (
    <HStack
      justifyContent="space-between"
      gap={{ base: "2", lg: "2" }}
      position="relative"
      alignItems="center"
      w="100%"
    >
      <HStack
        gap="2"
        minW={0}
        flex="1"
        alignItems="center"
      >
        <ExchangerName
          name={displayName}
          logo={maker.avatar}
          statusColor={statusToColor(effectiveStatus)}
        />
        <EditName />
        <MakerTags tags={maker.exchanger_tags} />
      </HStack>

      <HStack
        gap={{ base: "1", lg: "2" }}
        flexShrink={0}
        justifyContent="flex-end"
      >
        <EditStatus />
        <MakersLinks />
        <SaveMaker />
      </HStack>
    </HStack>
  );
}
