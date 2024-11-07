import { Text, Box, Heading } from "@chakra-ui/react";
import { ResponsiveText } from "../../styles/theme/custom";
import { fillWords } from "./helper";
import { IPm } from "../../types/selector";
import { useAppSelector } from "../../redux/hooks";
import { IDirText } from "../../types/exchange";
const DirText = ({
  dirText,
  givePm,
  getPm,
  locale,
}: {
  dirText?: IDirText;
  givePm: IPm;
  getPm: IPm;
  locale: "en" | "ru";
}) => {
  const cityCountry = useAppSelector(
    (state) =>
      state.main.city[`${locale}_name`] +
      " / " +
      state.main.city[`${locale}_country_name`]
  );

  if (!dirText) return <></>;
  const { text, title } = dirText;
  return (
    <Box p="2">
      <Heading as="h2" fontSize="3xl">
        {title}
      </Heading>
      <ResponsiveText whiteSpace="unset" variant="no_contrast">
        {fillWords({ text, givePm, getPm, cityCountry })}
      </ResponsiveText>
    </Box>
  );
};

export default DirText;
