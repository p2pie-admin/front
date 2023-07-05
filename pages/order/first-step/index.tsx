import { RegularBox } from "../../../styles/theme/wrappers";
import { AiOutlinePlus } from "react-icons/ai";
import { Box, HStack, Text } from "@chakra-ui/react";
import SuggestedRate from "./SuggestedRate";
import { useState } from "react";
import { useAppSelector } from "../../../redux/hooks";

const SelectCurrency = () => {
  const atLeastOneDirSelected = useAppSelector(
    (state) => state.main.givePm?.code && state.main.getPm?.code
  );
  const openedRates = [1];
  return (
    <Box overflowY="auto" maxH="500" px="1">
      <Text fontSize="lg" color="bg.300">
        Choose directions:
      </Text>

      {atLeastOneDirSelected && (
        <HStack
          bgColor="green.900"
          py="1"
          px="2"
          mt="4"
          borderRadius="lg"
          justifyContent="space-between"
        >
          <Text>Found 18 P2P rates starting from 1 BTC = 18 900 RUB</Text>
          <Text fontWeight="bold">SEE ALL</Text>
        </HStack>
      )}
      {openedRates.map((_, index) => (
        <SuggestedRate key={index} />
      ))}

      {atLeastOneDirSelected && (
        <RegularBox
          variant="no_contrast"
          h="16"
          border="2px dashed"
          borderColor="bg.500"
          display="flex"
          justifyContent="center"
          alignItems="center"
          cursor="pointer"
          mt="4"
          _hover={{
            filter: "brightness(0.8)",
          }}
          _active={{
            filter: "brightness(1.1)",
          }}
        >
          <AiOutlinePlus size="1.5rem" />
        </RegularBox>
      )}
    </Box>
    // <Tabs isLazy variant="soft-rounded" colorScheme="green">
    //   <TabList>
    //     <Tab>RUB</Tab>
    //     <Tab>USD</Tab>
    //     <Tab>TRY</Tab>
    //   </TabList>
    //   <TabPanels>
    //     <TabPanel>
    //       <SelectPms currencyCode="rub" />
    //     </TabPanel>
    //     <TabPanel>
    //       <SelectPms currencyCode="usd" />
    //     </TabPanel>
    //     <TabPanel>
    //       <SelectPms currencyCode="try" />
    //     </TabPanel>
    //   </TabPanels>
    // </Tabs>
  );
};

export default SelectCurrency;
