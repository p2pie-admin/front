import { Box } from "@chakra-ui/react";
import { IPhysicalExchanger } from "../../../types/exchanger";
import PhysicalExchangerRates from "./PhysicalExchangerRates";

const PhysicalExchangerCard = ({
  physicalExchanger,
}: {
  physicalExchanger: IPhysicalExchanger;
}) => {
  const { physical_rates, opened } = physicalExchanger;
  return <>{opened && <PhysicalExchangerRates rates={physical_rates} />}</>;
};

export default PhysicalExchangerCard;
