import { Grid, HStack, Tooltip } from "@chakra-ui/react";
import React from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import { RiInformationLine } from "react-icons/ri";

const text =
  "Курсы с разными способами оплаты объединяются при отличии не более, чем на 1%";

export default function Headers() {
  return (
    <Grid
      gridTemplateColumns="1fr 3rem 100px 1fr  1fr"
      w="100%"
      gap={["2", "4"]}
      mt="5"
      px="2"
      borderRadius="lg"
      color="bg.400"
    >
      <ResponsiveText size="xs">Обменник</ResponsiveText>
      <ResponsiveText size="xs">Рейтинг</ResponsiveText>
      <ResponsiveText size="xs">Параметры</ResponsiveText>
      <Tooltip openDelay={500} hasArrow label={text} size="md">
        <HStack justifySelf="start" position="relative">
          <RiInformationLine size="1.2rem" />

          <ResponsiveText textAlign="end" size="xs">
            Курс
          </ResponsiveText>
        </HStack>
      </Tooltip>
      <ResponsiveText textAlign="end" size="xs">
        Способы оплаты
      </ResponsiveText>
    </Grid>
  );
}
