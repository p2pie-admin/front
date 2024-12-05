import { Grid, Box } from "@chakra-ui/react";
import React from "react";
import { initParserFetcher } from "../../../../services/fetchers";
import useSWR from "swr";
import { ISelectorCountry } from "../../../../types/city";
import ErrorWrapper from "../../../shared/ErrorWrapper";
import Country from "./Country";

export default function Countries() {
  const fetcher = initParserFetcher();

  const { data, error } = useSWR("city_selector", fetcher) as {
    data: ISelectorCountry[];
    error: boolean;
  };
  console.log("data", data);

  return (
    <ErrorWrapper isError={error} isLoading={!data}>
      <Grid gridTemplateColumns="1fr 1fr 1fr" mt="4" p="4">
        {data &&
          data.map((country, index) => (
            <Box key={index}>
              <Country key={country.en_country_name} country={country} />
            </Box>
          ))}
      </Grid>
    </ErrorWrapper>
  );
}
