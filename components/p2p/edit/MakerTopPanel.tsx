import { Button, HStack } from "@chakra-ui/react";
import { IDotColors } from "../../../types/exchanger";
import { IMaker } from "../../../types/p2p";
import ExchangerName from "../../shared/ExchangerNameRating";
import MakerTags from "../maker/topPanel/MakerTags";
import { IoMdSave } from "react-icons/io";
import { RiDeleteBin2Fill } from "react-icons/ri";
import MakerTopPanelMenu from "./MakerTopPanelMenu";
import DeleteProject from "./DeleteProject";

export default function MakerTopPanel({ maker }: { maker: IMaker }) {
  const statusColor: IDotColors =
    maker.status === "active" ? "green" : "orange";

  return (
    <HStack justifyContent="space-between" gap="2" position="relative">
      <ExchangerName
        name={maker.telegram_name || maker.slug?.toUpperCase() || ""}
        logo={maker.avatar}
        statusColor={statusColor}
      />

      <MakerTags tags={maker.exchanger_tags} />

      <HStack>
        <Button variant="no_contrast" onClick={(e) => e.stopPropagation()}>
          <IoMdSave size="1.2rem" />
        </Button>
        <MakerTopPanelMenu maker={maker} />
        <DeleteProject maker={maker} />
      </HStack>
    </HStack>
  );
}
