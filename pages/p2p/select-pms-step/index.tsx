import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import SelectPms from "./SelectPms";

const SelectCurrency = () => {
  return (
    <Tabs isLazy variant="soft-rounded" colorScheme="green">
      <TabList>
        <Tab>RUB</Tab>
        <Tab>USD</Tab>
        <Tab>TRY</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SelectPms currencyCode="rub" />
        </TabPanel>
        <TabPanel>
          <SelectPms currencyCode="usd" />
        </TabPanel>
        <TabPanel>
          <SelectPms currencyCode="try" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default SelectCurrency;
