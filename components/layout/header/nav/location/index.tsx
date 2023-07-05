import { Button, Text, useColorModeValue } from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../../../../redux/hooks";
import { triggerModal } from "../../../../../redux/mainReducer";
import CustomModal from "../../../../shared/CustomModal";
import CountryListWrapper from "./CountryListWrapper";

const Location = () => {
  const { en_city_name, ru_city_name } = useAppSelector(
    (state) => state.main.location
  );

  const dispatch = useAppDispatch();
  return (
    <>
      <CustomModal id="location" header={"Choose the City"}>
        <CountryListWrapper />
      </CustomModal>
      <Button
        variant="contrast"
        p="1"
        onClick={() => dispatch(triggerModal("location"))}
      >
        {en_city_name}
      </Button>
    </>
  );
};

export default Location;
