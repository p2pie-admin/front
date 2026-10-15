import { Grid, HStack, Tooltip } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiInformationLine } from "react-icons/ri";
import { useT } from "../../../services/i18n";

export default function Headers() {
  const t = useT();
  const text = t(
    "Курсы с разными способами оплаты объединяются при отличии не более, чем на 1%",
    "Rates with different payment methods are merged when they differ by no more than 1%"
  );
  return (
    <Grid
      gridTemplateColumns="4fr 3rem 4fr 3fr"
      w="100%"
      gap={["2", "6"]}
      mt="5"
      px="2"
      borderRadius="lg"
      color="bg.400"
    >
      <ResponsiveText size="xs">{t("Обменник", "Exchanger")}</ResponsiveText>
      <ResponsiveText size="xs">{t("Рейтинг", "Rating")}</ResponsiveText>
      <Tooltip openDelay={500} hasArrow label={text} size="md">
        <HStack>
          <ResponsiveText textAlign="end" size="xs">
            {t("Курс", "Rate")}
          </ResponsiveText>
          <RiInformationLine size="1.2rem" />
        </HStack>
      </Tooltip>
      <ResponsiveText textAlign="end" size="xs">
        {t("Способы оплаты", "Payment methods")}
      </ResponsiveText>
    </Grid>
  );
}
