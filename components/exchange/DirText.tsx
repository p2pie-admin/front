import { Text, Box, Heading, Link } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
import { fillWords } from "./helper";
import { IPm } from "../../types/selector";
import { useAppSelector } from "../../redux/hooks";
import { ICity, IDirText } from "../../types/exchange";
import { useRouter } from "next/router";

const DirText = ({
  dirText,
  givePm,
  getPm,
  slug,
  city,
}: {
  dirText?: IDirText;
  givePm: IPm;
  getPm: IPm;
  slug: string;
  city?: ICity;
}) => {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const cityCountry = useAppSelector(
    (state) =>
      `${
        locale === "ru"
          ? state.main.city.preposition
          : state.main.city[`${locale}_name`]
      } / ${state.main.city[`${locale}_country_name`]}`
  );

  if (!dirText) return <></>;
  const { text, title } = dirText;

  return (
    <Box p="2">
      <Heading as="h2" fontSize="3xl">
        {fillWords({ title, givePm, getPm, cityCountry })}
      </Heading>
      <ResponsiveText whiteSpace="unset" variant="no_contrast">
        {text}
      </ResponsiveText>
    </Box>
  );
};

export default DirText;
