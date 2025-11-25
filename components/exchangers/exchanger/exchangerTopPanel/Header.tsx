import { Box, HStack } from "@chakra-ui/react";
import Dot from "../../Dot";
import ExchangerName from "../../../shared/ExchangerNameRating";
import { IDotColors, IExchanger } from "../../../../types/exchanger";
import TagBadges from "./TagBadges";

const Header = ({ exchanger }: { exchanger: IExchanger }) => {
  const statusColor: IDotColors =
    exchanger.status === "active" ? "green" : "orange";

  return (
    <HStack gap="2" position="relative">
      <ExchangerName
        name={exchanger.name}
        logo={exchanger.logo}
        admin_rating={exchanger.admin_rating}
        isH1={true}
        statusColor={statusColor}
      />
      <Box ml="auto">
        <TagBadges tags={exchanger.exchanger_tags} />
      </Box>
    </HStack>
  );
};

export default Header;
