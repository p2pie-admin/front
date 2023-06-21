import { Box, Text, Collapse, Highlight } from "@chakra-ui/react";
import { useState } from "react";
import { batch } from "react-redux";
import { useAppDispatch } from "../../../../../redux/hooks";
import { setLocation, triggerModal } from "../../../../../redux/mainReducer";
import { ICity, IFormattedCountry } from "../../../../../types/shared";
import { popularCountryNames } from "./helper";

const Country = ({ country }: { country: IFormattedCountry }) => {
  const [opened, setOpened] = useState(false);
  const isPopular = popularCountryNames.find(
    (c) => c.toLowerCase() === country.en_name.toLowerCase()
  );
  const dispatch = useAppDispatch();
  const handleChooseCity = (city: ICity) => {
    batch(() => {
      dispatch(
        setLocation({
          en_city_name: city.en_name,
          ru_city_name: city.ru_name,
          en_country_name: country.en_name,
          ru_country_name: country.ru_name,
          code: city.code,
        })
      );
      dispatch(triggerModal("location"));
    });
  };
  return (
    <Box>
      <Text
        fontWeight={isPopular ? "bold" : "normal"}
        fontSize="xl"
        color={opened ? "primary.200" : "bg.50"}
        cursor="pointer"
        onClick={() => setOpened(!opened)}
      >
        {country.en_name}
      </Text>
      <Collapse in={opened}>
        {country.cities.map((city) => (
          <Text ml="1" cursor="pointer" onClick={() => handleChooseCity(city)}>
            {city.en_name}
          </Text>
        ))}
        <Box h="4"></Box>
      </Collapse>
    </Box>
  );
};

export default Country;
