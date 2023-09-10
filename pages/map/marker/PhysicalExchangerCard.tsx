import { Box } from "@chakra-ui/react";
import { IPhysicalExchanger } from "../../../types/exchanger";
import PhysicalExchangerRates from "./PhysicalExchangerRates";
import CustomImage from "../../../components/shared/CustomImage";

const PhysicalExchangerCard = ({
  physicalExchanger,
}: {
  physicalExchanger: IPhysicalExchanger;
}) => {
  const { physical_rates, opened, photo } = physicalExchanger;
  return (
    <Box>
      <Box mt="2" overflow="hidden" borderRadius="lg">
        {photo && <CustomImage img={photo} w={"200px"} h={"200px"} />}
      </Box>

      {opened && <PhysicalExchangerRates rates={physical_rates} />}
    </Box>
  );
};

export default PhysicalExchangerCard;
