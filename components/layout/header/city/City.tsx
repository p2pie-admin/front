import Link from "next/link";
import { Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

import { pmsToSlug } from "../../../main/side/selector/section/PmGroup/helper";
import { fetchCity } from "../../../../redux/thunks";
import { useRouter } from "next/router";
import { ISelectorCity } from "../../../../types/city";
import { weights } from "./helper";
import { setDirRatesStatus, triggerModal } from "../../../../redux/mainReducer";
import { batch } from "react-redux";
import { slugCityToExchange } from "../../../exchange/exchangeHelper";

export default function City({
  city,
  dir,
  pageType,
}: {
  city?: ISelectorCity;
  dir?: string;
  pageType?: string;
}) {
  const { locale } = useRouter();
  const slug = useAppSelector((state) =>
    pmsToSlug({ givePm: state.main.givePm, getPm: state.main.getPm })
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleChooseCity = (en_name: string) => {
    const citySlug = en_name.replaceAll(" ", "-").toLowerCase();
    if (pageType == "cash" && slug) {
      router.push(`/${slugCityToExchange(slug, citySlug)}`);
    }
    if (pageType == "map") {
      router.push(`/map/${citySlug}`);
    }

    batch(() => {
      dispatch(fetchCity(en_name));
      dir && dispatch(setDirRatesStatus("pending"));
      dispatch(triggerModal(undefined));
    });
  };
  if (!city) return <></>;
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
