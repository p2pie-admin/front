import { Box, Collapse, Grid, Highlight, Text } from "@chakra-ui/react";
import useSWR from "swr";
import { initCMSFetcher } from "../../../../../services/fetchers";
import { ICityCodesList } from "../../../../../types/shared";

import ErrorWrapper from "../../../../shared/ErrorWrapper";
import citiesQuery from "./citiesQuery";
import CountryList from "./CountryList";

const CountryListWrapper = () => {
  const fetcher = initCMSFetcher();
  const { data, error } = useSWR(citiesQuery, fetcher) as {
    data: {
      parserSetting: { cities: ICityCodesList };
    };
    error: boolean;
  };

  return (
    <ErrorWrapper isError={!!error} isLoading={!data}>
      <CountryList cityCodesList={data?.parserSetting?.cities} />
    </ErrorWrapper>
  );
};

export default CountryListWrapper;
