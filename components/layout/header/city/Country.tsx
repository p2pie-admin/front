import React, { useState } from "react";
import { ISelectorCountry } from "../../../../types/city";
import { Box, Text, Collapse, Grid } from "@chakra-ui/react";


import City from "./City";
import { pickName, useLocale } from "../../../../services/i18n";

export default function Country({
  country,
  dir,
  pageType,
}: {
  country: ISelectorCountry;
  dir?: string;
  pageType?: string;
}) {
  const locale = useLocale();
  const cityName = (c: { ru_name?: string; en_name: string }) => pickName(c as Record<string, any>, locale);
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
        {pickName(country, locale, "country_name") + ":"}
      </Text>
      <Grid gridTemplateColumns="1fr  1fr" mt="2" p="2">
        {[...country.cities]
          .sort((a, b) =>
            cityName(a).localeCompare(cityName(b))
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
