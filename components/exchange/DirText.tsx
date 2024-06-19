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
  const userLocation = useAppSelector(
    (state) =>
      state.main.location[`${locale}_city_name`] +
      " / " +
      state.main.location[`${locale}_country_name`]
  );
  const city = userLocation || "";
  if (!dirText) return <></>;
  const { text, title } = dirText;
  return (
    <Box p="2">
      <Heading as="h2" fontSize="3xl">
        {title}
      </Heading>
      <ResponsiveText whiteSpace="unset" variant="no_contrast">
        {fillWords({ text, givePm, getPm, cityName: city })}
      </ResponsiveText>
    </Box>
  );
};

export default DirText;
