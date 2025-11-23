import React, { useState } from "react";
import { ISelectorCountry } from "../../../../types/city";
import { Box, Text, Collapse, Grid } from "@chakra-ui/react";

import { useRouter } from "next/router";

import City from "./City";

export default function Country({
  country,
  dir,
  pageType,
}: {
  country: ISelectorCountry;
  dir?: string;
  pageType?: string;
}) {
  const { locale } = useRouter();

  return (
    <>
      <Text
        my="1"
        p="1"
        fontWeight={"bold"}
        fontSize={"4xl"}
        variant={"extra_contrast"}
        cursor="pointer"
      >
        {country[`${locale as "en" | "ru"}_country_name`] + ":"}
      </Text>
      <Grid gridTemplateColumns="1fr  1fr" mt="2" p="2">
        {[...country.cities]
          .sort((a, b) =>
            a[`${locale}_name` as "en_name" | "ru_name"].localeCompare(
              b[`${locale}_name` as "en_name" | "ru_name"]
            )
          )
          .map((city) => {
            // const popularCityName =
            // city.en_name.toLowerCase() as keyof typeof popularCityNames;
            // const country.weight = popularCityNames?.[popularCityName] || "";
            // const selected = highlightedCities.find((c) => c == city.en_name);

            //const bullet = !isMultiple ? "" : selected ? "•" : "◦";
            return (
              <City
                key={city.en_name}
                city={city}
                dir={dir}
                pageType={pageType}
              />
            );
          })}
      </Grid>
    </>
  );
}
