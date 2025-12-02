import React from "react";
import { Box, Divider, Flex, HStack } from "@chakra-ui/react";
import { IExchanger } from "../../../../types/exchanger";
import Header from "./Header";
import Actions from "./Actions";
import { TopButtons } from "./TopButtons";
import TagBadges from "./TagBadges";

const ExchangerTopPanel = ({ exchanger }: { exchanger: IExchanger }) => {
  return (
    <>
      {/* <Box display={{ base: "block", lg: "none" }} w="100%">
        <HStack justifyContent="space-between" gap="4">
          <Header exchanger={exchanger} />
          <Box mr="auto">
            <TagBadges tags={exchanger.exchanger_tags} />
          </Box>
          <Actions exchanger={exchanger} />
        </HStack>
      </Box> */}

      <Box w="100%">
        <HStack justifyContent="space-between" gap="2" position="relative">
          <Header exchanger={exchanger} />
          <Box mr="auto">
            <TagBadges tags={exchanger.exchanger_tags} />
          </Box>
          <Actions exchanger={exchanger} />
          <Box display={{ base: "none", lg: "flex" }} flexDir="row" gap="2">
            <TopButtons exchanger={exchanger} />
          </Box>
        </HStack>
      </Box>
    </>
  );
};

export default ExchangerTopPanel;
