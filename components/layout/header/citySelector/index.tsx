import { HStack } from "@chakra-ui/react";

import Location from "./location";
import MultipleCitiesContext from "./location/MultipleCitiesContext";

const CitySelector = () => {
  return (
    <HStack spacing="2">
      <MultipleCitiesContext.Provider value={false}>
        <Location />
      </MultipleCitiesContext.Provider>
    </HStack>
  );
};

export default CitySelector;
