import { Text } from "@chakra-ui/react";
import { useAppSelector } from "../../../../redux/hooks";
import CustomModal from "../../../shared/CustomModal";

const PopularRates = ({
  isOpened,
  setOpened,
}: {
  isOpened: boolean;
  setOpened: Function;
}) => {
  const pendingPopularRates = useAppSelector(
    (state) => state.main.pendingPopularRates
  );
  return (
    <CustomModal
      id="popular-rates"
      header="test"
      isLoading={pendingPopularRates}
      isError={false}
    >
      <Text>test</Text>
    </CustomModal>
  );
};

export default PopularRates;
