import React from "react";
import { Box, Divider, Flex, HStack } from "@chakra-ui/react";
import { IExchanger } from "../../../../types/exchanger";
import Header from "./Header";
import Actions from "./Actions";
import { TopButtons } from "./TopButtons";

const ExchangerTopPanel = ({ exchanger }: { exchanger: IExchanger }) => {
  return (
    <>
      <Box display={{ base: "block", lg: "none" }}>
        <HStack justifyContent="space-between" gap="4">
          <Header exchanger={exchanger} />
          <Actions exchanger={exchanger} />
        </HStack>
      </Box>

      <Box display={{ base: "none", lg: "block" }}>
        <HStack justifyContent="space-between" gap="4">
          <Header exchanger={exchanger} />
          <HStack>
            <Actions exchanger={exchanger} />
            <TopButtons exchanger={exchanger} />
          </HStack>
        </HStack>
      </Box>
    </>
  );
};

export default ExchangerTopPanel;
