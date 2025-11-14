import Link from "next/link";
import { Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { pmsToSlug } from "../../../main/side/selector/section/PmGroup/helper";
import { fetchCity, fetchDirRates } from "../../../../redux/thunks";
import { useRouter } from "next/router";
import { ISelectorCity } from "../../../../types/city";
import { weights } from "./helper";
import { setDirRatesStatus, triggerModal } from "../../../../redux/mainReducer";
import { batch } from "react-redux";
import { slugCityToExchange } from "../../../exchange/exchangeHelper";

export default function City({
  city,
  dir,
}: {
  city?: ISelectorCity;
  dir?: string;
}) {
  const { locale } = useRouter();
  const slug = useAppSelector((state) =>
    pmsToSlug({ givePm: state.main.givePm, getPm: state.main.getPm })
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChooseCity = (en_name: string) => {
    router.push(`/${slugCityToExchange(slug, en_name)}`);
    batch(() => {
      dispatch(fetchCity(en_name));
      dir &&
        dispatch(fetchDirRates({ dir, cityName: en_name, trigger: "manual" }));
      dir && dispatch(setDirRatesStatus("pending"));
      dispatch(triggerModal(undefined));
    });
  };
  if (!dir || !city) return <></>;
  const weight = weights[city.population || 0];
  return (
    // <Link
    //   onClick={() => dispatch(triggerModal(undefined))}
    //   href={`/${slugCityToExchange(slug, city.en_name)}`}
    //   passHref
    // >
    <Text
      ml="1"
      mt="1"
      onClick={() => handleChooseCity(city.en_name)}
      key={city.en_name}
      cursor="pointer"
      fontWeight={weight?.fontWeight || "bold"}
      fontSize={city.en_name.length < 10 ? weight?.fontSize : "lg"}
      variant={weight?.variant || "extra_contrast"}
    >
      {city[`${locale as "en" | "ru"}_name`]}
    </Text>
    // </Link>
  );
}
