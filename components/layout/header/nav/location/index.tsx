import { Button, Text, useColorModeValue } from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../../../../redux/hooks";
import { triggerModal } from "../../../../../redux/mainReducer";
import CustomModal from "../../../../shared/CustomModal";
import CountryListWrapper from "./CountryListWrapper";
import MultipleCitiesContext from "./MultipleCitiesContext";
import { useContext } from "react";

const Location = () => {
  const locations = useAppSelector((state) => state.main.locations);
  console.log(locations);
  const dispatch = useAppDispatch();
  const isMultiple = useContext(MultipleCitiesContext);
  const cityNames = locations.filter((l) => l.en_city_name !== "");

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
        {isMultiple ? `+` : ">"}
      </Button>
    </>
  );
};

export default Location;
