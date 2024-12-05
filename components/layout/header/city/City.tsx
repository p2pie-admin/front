import Link from "next/link";
import { Text } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { slugCityToExchange } from "../../../exchange/helper";
import { pmsToSlug } from "../../../main/side/selector/section/PmGroup/helper";
import { fetchCity } from "../../../../redux/thunks";
import { useRouter } from "next/router";
import { ISelectorCity } from "../../../../types/city";
import { weights } from "./helper";

export default function City({ city }: { city?: ISelectorCity }) {
  const { locale } = useRouter();
  const slug = useAppSelector((state) =>
    pmsToSlug({ givePm: state.main.givePm, getPm: state.main.getPm })
  );

  const dispatch = useAppDispatch();

  const handleChooseCity = (en_name: string) => {
    dispatch(fetchCity(en_name));
  };
  if (!city) return <></>;
  const weight = weights[city.population || 0];
  return (
    <Link href={`/${slugCityToExchange(slug, city.en_name)}`} passHref>
      <Text
        ml="1"
        mt="1"
        key={city.en_name}
        cursor="pointer"
        fontWeight={weight?.fontWeight || "bold"}
        fontSize={weight?.fontSize || "xl"}
        variant={weight?.variant || "extra_contrast"}
        onClick={() => handleChooseCity(city.en_name)}
      >
        {city[`${locale as "en" | "ru"}_name`]}
      </Text>
    </Link>
  );
}
