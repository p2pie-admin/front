import { Flex, Wrap } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";

import { IExchanger, IParserExchanger } from "../../types/exchanger";

import { Box3D, ResponsiveText } from "../../styles/theme/custom";

import { loadInitialData } from "../../services/loadInitialData";
import Dot from "../../components/exchangers/Dot";
import Exchanger from "../../components/exchangers";
import { useState, useMemo } from "react";
import SortButtons from "../../components/exchangers/SortButtons";

export default function ExchangersList({
  exchangers,
}: {
  exchangers: (IExchanger & IParserExchanger)[];
}) {
  const [sortCriteria, setSortCriteria] = useState<
    "name" | "total_rates" | "admin_rating"
  >("name");

  const sortedExchangers = useMemo(() => {
    return exchangers.slice().sort((a, b) => {
      if (sortCriteria === "name") {
        return a.name.localeCompare(b.name, "ru", { sensitivity: "base" });
      } else if (sortCriteria === "total_rates") {
        return (b.total_rates || 0) - (a.total_rates || 0);
      } else if (sortCriteria === "admin_rating") {
        return (Number(b?.admin_rating) || 0) - (Number(a?.admin_rating) || 0);
      }
      return 0;
    });
  }, [exchangers, sortCriteria]);

  if (!exchangers?.length) return <>no exchangers</>;

  return (
    <Box3D p="4" variant="no_contrast" mt="10">
      <ResponsiveText fontWeight="bold" size="xl" variant="primary">
        Exchangers List:
      </ResponsiveText>

      <Flex justify="flex-end" mt="4">
        <SortButtons sortCriteria={sortCriteria} toggleSort={setSortCriteria} />
      </Flex>

      <Wrap mt="4">
        {sortedExchangers.map((exchanger) => (
          <Exchanger key={exchanger.id} exchanger={exchanger} />
        ))}
      </Wrap>
    </Box3D>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const cachedData = await loadInitialData();
  const { exchangers } = cachedData || {};

  if (!exchangers?.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      exchangers,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
    revalidate: 4000,
  };
};
