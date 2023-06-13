import { Button, Text, useColorModeValue } from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../../../../redux/hooks";
import { triggerModal } from "../../../../../redux/mainReducer";
import CustomModal from "../../../../shared/CustomModal";
import CountryList from "./CountryList";

const Location = () => {
  const { city } = useAppSelector((state) => state.main.location);
  const variant = useColorModeValue("gray", "black");
  const dispatch = useAppDispatch();
  return (
    <>
      <CustomModal id="location" header={"Please Choose the City"}>
        <CountryList />
      </CustomModal>
      <Button
        variant={variant}
        p="1"
        onClick={() => dispatch(triggerModal("location"))}
      >
        <Text>{city}</Text>
      </Button>
    </>
  );
};

export default Location;
