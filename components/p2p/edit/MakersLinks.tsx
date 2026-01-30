import { Button, HStack } from "@chakra-ui/react";
import { IDotColors } from "../../../types/exchanger";
import { IMaker } from "../../../types/p2p";
import ExchangerName from "../../shared/ExchangerNameRating";
import MakerTags from "../maker/topPanel/MakerTags";
import { IoMdSave } from "react-icons/io";
import { RiDeleteBin2Fill } from "react-icons/ri";
import MakersLinks from "./MakerTopPanelMenu";
import DeleteProject from "./DeleteProject";
import { useAppDispatch } from "../../../redux/hooks";
import { saveProjectP2P } from "../../../redux/thunks";

export default function MakerTopPanel({ maker }: { maker: IMaker }) {
  const dispatch = useAppDispatch();

  const statusColor: IDotColors =
    maker.status === "active" ? "green" : "orange";

  const handleSaveProject = (e: any) => {
    e.stopPropagation();
    dispatch(saveProjectP2P);
  };

  return (
    <HStack justifyContent="space-between" gap="2" position="relative">
      <ExchangerName
        name={maker.telegram_name || maker.slug?.toUpperCase() || ""}
        logo={maker.avatar}
        statusColor={statusColor}
      />

      <MakerTags tags={maker.exchanger_tags} />

      <HStack>
        <Button variant="no_contrast" onClick={(e) => handleSaveProject(e)}>
          <IoMdSave size="1.2rem" />
        </Button>
        <MakersLinks maker={maker} />
        <DeleteProject maker={maker} />
      </HStack>
    </HStack>
  );
}
