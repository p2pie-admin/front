import {
  Button,
  HStack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { useAppSelector, useAppDispatch } from "../../../../../redux/hooks";
import { addLocation, triggerModal } from "../../../../../redux/mainReducer";
import CustomModal from "../../../../shared/CustomModal";
import CountryListWrapper from "./CountryListWrapper";
import MultipleCitiesContext from "./MultipleCitiesContext";
import { useContext } from "react";
import { RegularBox } from "../../../../../styles/theme/custom";
import { AiOutlinePlus } from "react-icons/ai";

const Location = () => {
  const locations = useAppSelector((state) => state.main.p2p.locations);
  const location = useAppSelector((state) => state.main.location);
  const citiesSelectedLength = useAppSelector(
    (state) => state.main.p2p.locations.length || ""
  );
  const dispatch = useAppDispatch();
  const isMultiple = useContext(MultipleCitiesContext);

  const SelectButton = () => (
    <RegularBox
      variant="contrast"
      display="flex"
      justifyContent="end"
      position="absolute"
      bottom="0"
      left="0"
      w="100%"
      p="4"
    >
      <Button variant="no_contrast" onClick={() => dispatch(triggerModal(""))}>
        {`Select ${citiesSelectedLength}`}
      </Button>
    </RegularBox>
  );

  const MultipleCities = () => (
    <RegularBox p="2">
      <HStack>
        <Button
          variant="contrast"
          p="2"
          onClick={() => dispatch(triggerModal("locations"))}
          leftIcon={<AiOutlinePlus size="1rem" />}
        >
          Add City
        </Button>
        <Wrap w="80%">
          {locations.map((l) => (
            <Tag
              size="sm"
              key={l.code}
              variant="outline"
              colorScheme="bg"
              mx="1"
              onClick={() => dispatch(addLocation(l))}
              cursor="pointer"
            >
              <TagLabel>{l.en_city_name}</TagLabel>
              <TagCloseButton />
            </Tag>
          ))}
        </Wrap>
      </HStack>
    </RegularBox>
  );

  return (
    <>
      <CustomModal
        id={isMultiple ? "locations" : "location"}
        header={"Choose the City"}
      >
        <>
          <CountryListWrapper />
          {isMultiple && <SelectButton />}
        </>
      </CustomModal>
      {isMultiple ? (
        <MultipleCities />
      ) : (
        <Button
          variant="extra_contrast"
          p="1"
          onClick={() => dispatch(triggerModal("location"))}
        >
          {location.en_city_name || "City"}
        </Button>
      )}
    </>
  );
};

export default Location;
