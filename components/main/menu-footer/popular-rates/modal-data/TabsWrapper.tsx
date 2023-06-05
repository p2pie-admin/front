import {
  Flex,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { Box3D } from "../../../../../styles/theme/wrappers";
import SideContext from "../../../../shared/SideContext";
import TabSide from "./tab-side";

const TabsWrapper = () => {
  return (
    <Tabs isFitted variant="solid-rounded" w="100%">
      <Flex justifyContent="center">
        <Box3D w="calc(100% - 32px)">
          <TabList mb="2" bgColor="transparent" m="0 !important">
            <Tab
              _selected={{ bgColor: "green.200", color: "green.800" }}
              borderRadius="2xl"
            >
              Buy
            </Tab>
            <Tab
              _selected={{ bgColor: "pink.200", color: "pink.800" }}
              borderRadius="2xl"
            >
              Sell
            </Tab>
          </TabList>
        </Box3D>
      </Flex>

      <TabPanels>
        <TabPanel>
          <SideContext.Provider value="buy">
            <TabSide />
          </SideContext.Provider>
        </TabPanel>
        <TabPanel>
          <SideContext.Provider value="sell">
            <TabSide />
          </SideContext.Provider>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TabsWrapper;
