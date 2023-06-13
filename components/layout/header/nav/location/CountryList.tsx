import { Box, Collapse, Grid, Highlight, Text } from "@chakra-ui/react";
import useSWR from "swr";
import { initCMSFetcher } from "../../../../../services/fetchers";
import { ICitiesList } from "../../../../../types/shared";
import ErrorWrapper from "../../../../shared/ErrorWrapper";
import citiesQuery from "./citiesQuery";
import Country from "./Country";
import { formatCities } from "./helper";

const CountryList = () => {
  const fetcher = initCMSFetcher();
  const { data, error } = useSWR(citiesQuery, fetcher) as {
    data: {
      parserSetting: { cities: ICitiesList };
    };
    error: boolean;
  };
  const cities = data?.parserSetting?.cities as ICitiesList;
  const cityCodes = Object.keys(data?.parserSetting?.cities);
  const ru = formatCities(0, cityCodes, cities);
  const en = formatCities(1, cityCodes, cities);
  console.log(ru);
  const list = Object.entries(en).sort();
  const threePartIndex = Math.ceil(list.length / 3);
  const parts = [
    list.splice(-threePartIndex),
    list.splice(-threePartIndex),
    list,
  ].reverse();

  return (
    <ErrorWrapper isError={!!error} isLoading={!data}>
      <Grid gridTemplateColumns="1fr 1fr 1fr">
        {parts.map((part, index) => (
          <Box p="2" key={index}>
            {part.map(([country, cities]) => (
              <Country country={country} cities={cities} />
            ))}
          </Box>
        ))}
      </Grid>
    </ErrorWrapper>
  );
};

export default CountryList;
