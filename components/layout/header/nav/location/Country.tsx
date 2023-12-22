import { Box, Text, Collapse, Highlight } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { batch } from "react-redux";
import { useAppDispatch } from "../../../../../redux/hooks";
import {
  addLocation,
  setLocation,
  triggerModal,
} from "../../../../../redux/mainReducer";
import { RegularBox } from "../../../../../styles/theme/custom";
import { ICity, IFormattedCountry } from "../../../../../types/shared";
import { popularCountryNames } from "./helper";
import MultipleCitiesContext from "./MultipleCitiesContext";

const Country = ({
  country,
  highlightedCities,
}: {
  country: IFormattedCountry;
  highlightedCities: string[];
}) => {
  const [opened, setOpened] = useState(false);
  const isPopular = popularCountryNames.find(
    (c) => c.toLowerCase() === country.en_name.toLowerCase()
  );
  const dispatch = useAppDispatch();
  const isMultiple = useContext(MultipleCitiesContext);
  const handleChooseCity = (city: ICity) => {
    const location = {
      en_city_name: city.en_name,
      ru_city_name: city.ru_name,
      en_country_name: country.en_name,
      ru_country_name: country.ru_name,
      code: city.code,
    };
    isMultiple
      ? dispatch(addLocation(location))
      : batch(() => {
          dispatch(setLocation(location));
          dispatch(triggerModal(undefined));
        });
  };
  return (
    <Box>
      <Text
        my="1"
        fontWeight={isPopular ? "bold" : "normal"}
        fontSize={isPopular ? "xl" : "lg"}
        variant="extra_contrast"
        cursor="pointer"
        onClick={() => setOpened(!opened)}
      >
        {country.en_name}
      </Text>
      <Collapse in={opened}>
        {country.cities.map((city) => (
          <Text
            ml="1"
            cursor="pointer"
            variant={
              highlightedCities.find((c) => c == city.en_name)
                ? "primary"
                : "contrast"
            }
            onClick={() => handleChooseCity(city)}
          >
            {city.en_name}
          </Text>
        ))}
      </Collapse>
    </Box>
  );
};

export default Country;
