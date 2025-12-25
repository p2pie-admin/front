import { Flex, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { getStatus } from "./helper";
import Dot from "./Dot";
import { useTranslation } from "next-i18next";

export default function ExchangersHeader({
  exchangers,
}: {
  exchangers: IExchanger[];
}) {
  const { t } = useTranslation();
  const statusCounts = useMemo(() => {
    const counts = { green: 0, orange: 0, red: 0 };
    exchangers?.forEach((exchanger) => {
      const status = getStatus(exchanger);
      if (status === "green") counts.green++;
      if (status === "orange") counts.orange++;
    });
    return counts;
  }, [exchangers]);
  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      justifyContent={"space-between"}
      px="4"
      py="2"
    >
      <ResponsiveText
        fontWeight="bold"
        fontSize="2xl"
        variant="primary"
        as="h1"
      >
        {t("exchangersPage")}
      </ResponsiveText>
      <HStack gap={{ base: "4", lg: "8" }} color="bg.200" mx="2">
        <HStack>
          <Dot />
          <ResponsiveText size="sm" variant="no_contrast">{`${t("Total")}: ${
            exchangers?.length || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="green" />
          <ResponsiveText size="sm" variant="no_contrast">{`${t("Active")}: ${
            statusCounts.green || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="orange" />
          <ResponsiveText size="sm" variant="no_contrast">{`${t(
            "Suspended"
          )}: ${statusCounts.orange || "-"}`}</ResponsiveText>
        </HStack>
      </HStack>
    </Flex>
  );
}
