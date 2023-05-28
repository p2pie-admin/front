import { Box, Text } from "@chakra-ui/react";
import { useAppSelector } from "../../../../redux/hooks";
import CustomModal from "../../../shared/CustomModal";

const PopularRates = () => {
  const pendingPopularRates = useAppSelector(
    (state) => state.main.pendingPopularRates
  );
  const populatRates = useAppSelector((state) => state.main.popularRates);
  const isError = !populatRates || !Object.keys(populatRates).length;
  return (
    <CustomModal
      id="popular-rates"
      header="test"
      isLoading={pendingPopularRates}
      isError={isError}
    >
      <Box p="2" minH="200">
        {!isError && <Text>test</Text>}
      </Box>
    </CustomModal>
  );
};

export default PopularRates;
