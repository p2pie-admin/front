import { RegularBox } from "../../../styles/theme/wrappers";
import { AiOutlinePlus } from "react-icons/ai";
import { Box, HStack, Text } from "@chakra-ui/react";
import SuggestedRate from "./SuggestedRate";
import { useContext, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { addEmptyDir, addPm } from "../../../redux/mainReducer";
import P2PContext from "../../../components/shared/contexts/p2pContext";
import { batch } from "react-redux";

const SelectCurrency = () => {
  const dispatch = useAppDispatch();
  const dirs = useAppSelector((state) => state.main.p2p.dirs);
  const lastIndex = dirs.length - 1;
  const lastDirSelected =
    dirs[lastIndex].give?.code && dirs[lastIndex].get?.code;

  return (
    <Box px="1">
      <Text fontSize="lg" color="bg.300">
        Choose directions:
      </Text>
      {/* 
      {lastDirSelected && (
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
      )} */}
      {dirs.map((dir, index) => (
        <SuggestedRate key={index} dir={dir} index={index} />
      ))}

      {lastDirSelected && dirs.length < 3 && (
        <RegularBox
          onClick={() => dispatch(addEmptyDir())}
          variant="no_contrast"
          h="16"
          border="2px dashed"
          borderColor="bg.500"
          display="flex"
          justifyContent="center"
          alignItems="center"
          cursor="pointer"
          mt="4"
          transition="filter 0.2s"
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
