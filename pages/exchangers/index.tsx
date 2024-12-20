import Link from "next/link";
import { Button, Wrap } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetStaticProps } from "next";
import { initCMSFetcher } from "../../services/fetchers";
import { exchangersQuery } from "../../services/initialQueries";
import { IPmLayout } from "../../types/exchange";
import { IExchanger } from "../../types/general";
import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";

// const exchangersData = [
//   { name: "binance", displayName: "Binance" },
//   { name: "coinbase", displayName: "Coinbase" },
//   { name: "kraken", displayName: "Kraken" },
// ];

export default function ExchangersList({
  exchangers,
}: {
  exchangers: IExchanger[];
}) {
  if (!exchangers?.length) return <>no exchangers</>;
  return (
    <Box3D p="4" variant="no_contrast" mt="10">
      <ResponsiveText fontWeight="bold" size="xl" variant="primary">
        Exchangers List:
      </ResponsiveText>
      <Wrap p="2">
        {exchangers.map((exchanger) => (
          <li key={exchanger.name}>
            <Link
              href={`/exchangers/${exchanger.name
                .toLowerCase()
                .replaceAll(" ", "-")}`}
            >
              <Button>{capitalize(exchanger.name)}</Button>
            </Link>
          </li>
        ))}
      </Wrap>
    </Box3D>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const cmsFetcher = initCMSFetcher();

  const { exchangers } = (await cmsFetcher(exchangersQuery)) as {
    exchangers: IExchanger[];
  };

  return {
    props: {
      exchangers,
      ...(await serverSideTranslations(locale || "ru", ["main"])),
    },
  };
};
