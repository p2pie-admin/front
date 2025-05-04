import { useRouter } from "next/router";
import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { initCMSFetcher } from "../../services/fetchers";
import { exchangersQuery } from "../../services/initialQueries";
import { IExchanger } from "../../types/exchanger";
import { readCache, writeCache } from "../../cache";
import { ICache } from "../../types/exchange";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { Box, HStack, Text } from "@chakra-ui/react";

import { FiPlusCircle } from "react-icons/fi";
import { LinkWrapper } from "../../components/exchange/pmLayout/LinkWrapper";
import { TbExternalLink } from "react-icons/tb";
import { exchangerNameToSlug } from "./helper";

export default function ExchangerPage({
  exchanger,
  locale,
}: {
  exchanger: IExchanger;
  locale: "en" | "ru";
}) {
  const router = useRouter();
  //const { name } = router.query as { name: string };

  // Handle non-existent exchanger
  if (!exchanger) {
    return <ResponsiveText>Exchanger not found</ResponsiveText>;
  }
  //console.log(exchanger);

  const url = exchanger.ref_link;

  return (
    <Box3D p="4" variant="no_contrast" mt="10">
      <LinkWrapper url={url} articleExists={!!url}>
        <HStack>
          <ResponsiveText fontWeight="bold" size="xl" variant="primary">
            {capitalize(exchanger.name)}
          </ResponsiveText>
          <TbExternalLink size="1.5rem" />
        </HStack>
      </LinkWrapper>

      <Box>
        <ResponsiveText whiteSpace="unset">
          {exchanger.exchanger_card?.[`${locale}_description`]}
        </ResponsiveText>
      </Box>
    </Box3D>
  );
}

// Predefined exchangers data

// Generate paths for each exchanger
export async function getStaticPaths() {
  const cmsFetcher = initCMSFetcher();

  const { exchangers } = (await cmsFetcher(exchangersQuery)) as {
    exchangers: IExchanger[];
  };

  writeCache({ exchangers });
  const locales = ["en", "ru"];

  const paths = exchangers.reduce(
    (
      res: {
        params: { name: string };
        locale: string;
      }[],
      exchanger: IExchanger
    ) => [
      ...res,
      ...locales.map((locale) => ({
        params: { name: exchangerNameToSlug(exchanger.name) },
        locale,
      })),
    ],
    []
  );
  return { paths, fallback: false };
}

// Pass exchanger data to the page
export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { name: string };
}) {
  try {
    const { name } = params;

    const { exchangers } = readCache() as ICache;

    const exchanger =
      exchangers.find(
        (e) => exchangerNameToSlug(e.name) == name.toLowerCase()
      ) || null;
    return {
      props: {
        exchanger,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}
