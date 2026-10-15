import { Flex, HStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { ResponsiveText } from "../../../styles/theme/custom";
import Dot from "../../exchangers/Dot";
import { IMakerPreview } from "../../../types/p2p";
import { getMakerStatusColor } from "./helper";
import { useT } from "../../../services/i18n";

export default function MakersHeader({ makers }: { makers: IMakerPreview[] }) {
  const t = useT();
  const statusCounts = useMemo(() => {
    const counts = { green: 0, orange: 0 };
    makers?.forEach((maker) => {
      const status = getMakerStatusColor(maker);
      if (status === "green") counts.green++;
      if (status === "orange") counts.orange++;
    });
    return counts;
  }, [makers]);

  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      justifyContent="space-between"
      px="4"
      py="2"
    >
      <ResponsiveText
        fontWeight="bold"
        fontSize="2xl"
        variant="primary"
        as="h1"
      >
        {t("P2P мейкеры", "P2P makers")}
      </ResponsiveText>
      <HStack gap={{ base: "4", lg: "8" }} color="bg.200" mx="2">
        <HStack>
          <Dot />
          <ResponsiveText size="sm" variant="no_contrast">{`${t("Всего", "Total")}: ${
            makers?.length || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="green" />
          <ResponsiveText size="sm" variant="no_contrast">{`${t("Активные", "Active")}: ${
            statusCounts.green || "-"
          }`}</ResponsiveText>
        </HStack>

        <HStack>
          <Dot color="orange" />
          <ResponsiveText size="sm" variant="no_contrast">{`${t("Неактивные", "Inactive")}: ${
            statusCounts.orange || "-"
          }`}</ResponsiveText>
        </HStack>
      </HStack>
    </Flex>
  );
}
