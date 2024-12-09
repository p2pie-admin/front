import { Grid, Box } from "@chakra-ui/react";
import React from "react";
import { initParserFetcher } from "../../../../services/fetchers";
import useSWR from "swr";
import { ISelectorCountry } from "../../../../types/city";
import ErrorWrapper from "../../../shared/ErrorWrapper";
import Country from "./Country";
import { useAppSelector } from "../../../../redux/hooks";

export default function Countries() {
  const fetcher = initParserFetcher();
  const dir = useAppSelector((state) => {
    const [givePm, getPm] = [state.main.givePm, state.main.getPm];
    if (givePm && getPm) return `${givePm.code}_${getPm.code}`;
    return undefined;
  });
  const { data, error } = useSWR(`city_selector=${dir}`, fetcher) as {
    data: ISelectorCountry[];
    error: boolean;
  };
  if (!dir) return <></>;

  return (
    <ErrorWrapper isError={error} isLoading={!data}>
      <Box p="2">
        {data &&
          data.map((country, index) => (
            <Country
              key={country.en_country_name}
              country={country}
              dir={dir}
            />
          ))}
      </Box>
    </ErrorWrapper>
  );
}
