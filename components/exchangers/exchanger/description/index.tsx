import { HStack, Box, Divider } from "@chakra-ui/react";
import React from "react";

import { TextToHTML } from "../../../shared/helper";
import { IExchangerCard } from "../../../../types/exchanger";
import { locale } from "../../../../services/utils";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import ExchangerSocials from "./ExchangerSocials";
export default function ExchangerCard({
  exchangerCard,
}: {
  exchangerCard?: IExchangerCard | null;
}) {
  if (!exchangerCard) return <></>;
  const description =
    exchangerCard?.[`${locale}_description`] || "нет описания";

  return (
    <>
      <Box3D mt="4" p="4" variant="contrast">
        <ResponsiveText size="xl" fontWeight="bold" variant="primary">
          Данные
        </ResponsiveText>
        <Divider my="2" />
      </Box3D>
      <Box3D mt="4" p="4" variant="contrast">
        <ResponsiveText size="xl" fontWeight="bold" variant="primary">
          Описание
        </ResponsiveText>
        <Divider my="2" />
        {description && <TextToHTML text={description} />}
      </Box3D>

      <Box3D mt="4" p="4" variant="contrast">
        <ResponsiveText size="xl" fontWeight="bold" variant="primary">
          Адрес и контакты
        </ResponsiveText>
        <Divider my="2" />
      </Box3D>

      <ExchangerSocials exchangerCard={exchangerCard} />
    </>
  );
}
