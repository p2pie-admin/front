import { Button, Text, useColorModeValue } from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../../../../redux/hooks";
import { triggerModal } from "../../../../../redux/mainReducer";
import CustomModal from "../../../../shared/CustomModal";
import CountryListWrapper from "./CountryListWrapper";

const Location = () => {
  const { en_city_name, ru_city_name } = useAppSelector(
    (state) => state.main.location
  );
  const variant = useColorModeValue("gray", "black");
  const dispatch = useAppDispatch();
  return (
    <>
      <CustomModal id="location" header={"Please Choose the City"}>
        <CountryListWrapper />
      </CustomModal>
      <Button
        variant={variant}
        p="1"
        onClick={() => dispatch(triggerModal("location"))}
      >
        <Text>{en_city_name}</Text>
      </Button>
    </>
  );
};

export default Location;
