import { HStack, useColorModeValue } from "@chakra-ui/react";

import { ResponsiveText } from "../../../../../styles/theme/custom";

import { MdQueryStats } from "react-icons/md";

const FoundRates = () => {
  const bgColor = useColorModeValue("violet.300", "bg.900");

  return (
    <HStack
      justifyContent="space-between"
      bgColor={bgColor}
      py="1"
      px={["2", "4"]}
      my="2"
      borderRadius="lg"
    >
      <ResponsiveText size="xs">{`Found 18 P2P rates starting from 1 BTC = 3,398,000 RUB`}</ResponsiveText>

      <MdQueryStats size="1.2rem" />
    </HStack>
  );
};

export default FoundRates;
