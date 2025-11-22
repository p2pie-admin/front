import React from "react";
import { Flex } from "@chakra-ui/react";
import { IExchanger } from "../../../../types/exchanger";
import Header from "./Header";
import Actions from "./Actions";

const ExchangerTopPanel = ({ exchanger }: { exchanger: IExchanger }) => {
  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      justifyContent="space-between"
      gap="4"
    >
      <Header exchanger={exchanger} />
      <Actions exchanger={exchanger} />
    </Flex>
  );
};

export default ExchangerTopPanel;
