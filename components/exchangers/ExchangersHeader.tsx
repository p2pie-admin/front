import { Flex, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ResponsiveText } from "../../styles/theme/custom";
import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { getStatus } from "./helper";
import Dot from "./Dot";
import { useTranslation } from "react-i18next";

export default function ExchangersHeader({
  exchangers,
}: {
  exchangers: (IExchanger & IParserExchanger)[];
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
    <HStack justifyContent={"space-between"} px="4" py="2">
      <ResponsiveText fontWeight="bold" fontSize="2xl" variant="primary">
        {t("Exchangers")}
      </ResponsiveText>
      <Flex
        gap={{ base: "1", lg: "8" }}
        color="bg.200"
        flexDir={{ base: "column", lg: "row" }}
        mx="2"
      >
        <HStack>
          <Dot />
          <ResponsiveText>{`${t("Total")}: ${
            exchangers?.length || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="green" />
          <ResponsiveText>{`${t("Active")}: ${
            statusCounts.green || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="orange" />
          <ResponsiveText>{`${t("Suspended")}: ${
            statusCounts.orange || "-"
          }`}</ResponsiveText>
        </HStack>
      </Flex>
    </HStack>
  );
}
