import { Text, Box, Heading, Link } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";

import { IPm } from "../../types/selector";
import { useAppSelector } from "../../redux/hooks";
import { ICity, IDirText } from "../../types/exchange";
import { useRouter } from "next/router";
import { TextToHTML } from "../shared/helper";
import { fillWords } from "../../lib/exchangeHelper";

const DirText = ({
  dirText,
  givePm,
  getPm,

  city,
}: {
  dirText: IDirText | null;
  givePm: IPm;
  getPm: IPm;

  city: ICity | null;
}) => {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const cityCountry = useAppSelector((state) => {
    return `${
      locale === "ru"
        ? state.main.city.preposition
        : state.main.city[`${locale}_name`]
    } / ${state.main.city[`${locale}_country_name`]}`;
  });

  if (!dirText) return <></>;
  const { text, title } = dirText;

  return (
    <Box p="2">
      <Heading as="h2" fontSize="3xl">
        {fillWords({ title, givePm, getPm, cityCountry })}
      </Heading>
      <TextToHTML text={text} />
    </Box>
  );
};

export default DirText;
