import React, { useState } from "react";
import { ISelectorCountry } from "../../../../types/city";
import { Box, Text, Collapse } from "@chakra-ui/react";
import Link from "next/link";
import { slugCityToExchange } from "../../../exchange/helper";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { pmsToSlug } from "../../../main/side/selector/section/PmGroup/helper";

import { ICity } from "../../../../types/exchange";
import { fetchCity } from "../../../../redux/thunks";
import { weights } from "./helper";
import City from "./City";

export default function Country({ country }: { country: ISelectorCountry }) {
  const [opened, setOpened] = useState(false);
  const { locale } = useRouter();

  const weight = weights[country.weight || 0];
  return (
    <Box>
      <Text
        my="1"
        fontWeight={weight?.fontWeight || "bold"}
        fontSize={weight?.fontSize || "2xl"}
        variant={weight?.variant || "extra_contrast"}
        cursor="pointer"
        onClick={() => setOpened(!opened)}
      >
        {country[`${locale as "en" | "ru"}_country_name`]}
      </Text>
      <Collapse in={opened}>
        {country.cities.map((city) => {
          // const popularCityName =
          // city.en_name.toLowerCase() as keyof typeof popularCityNames;
          // const country.weight = popularCityNames?.[popularCityName] || "";
          // const selected = highlightedCities.find((c) => c == city.en_name);

          //const bullet = !isMultiple ? "" : selected ? "•" : "◦";
          return <City city={city} />;
        })}
      </Collapse>
    </Box>
  );
}
