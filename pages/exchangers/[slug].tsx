import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { ResponsiveText } from "../../styles/theme/custom";
import {
  addExchangerCrossLinking,
  exchangerNameToSlug,
  exchangerSlugToName,
} from "../../components/exchangers/helper";

import Exchanger from "../../components/exchangers/exchanger";
import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { ISEO } from "../../types/general";
import { getT } from "../../components/shared/getT";
import { nullSeo } from "../../components/shared/UniversalSeo";
import { ICache } from "../../types/exchange";

import {
  loadArticleCodes,
  loadExchanger,
  loadExchangers,
  loadPms,
} from "../../cache/loadInitialData";
import { IPm } from "../../types/selector";
import { Center, Spinner } from "@chakra-ui/react";

export default function ExchangerPage({
  exchanger,
  seo,
  articleCodes,
  pms,
  time,
}: {
  exchanger: (IExchanger & IParserExchanger) | null;
  seo: ISEO;
  articleCodes: string[];
  pms: IPm[];
  time: string;
}) {
  // Handle non-existent exchanger
  if (!exchanger) {
    console.log("exchanger", exchanger);
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Spinner size="xl" color="bg.500" />
      </Center>
    );
  }
  //mylog(exchanger);

  return (
    <Exchanger
      exchanger={exchanger}
      seo={seo}
      articleCodes={articleCodes}
      pms={pms}
      time={time}
    />
  );
}

// Pass exchanger data to the page
export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { slug: string };
}) {
  try {
    const { slug } = params;
    const name = exchangerSlugToName(slug);

    const start = performance.now();

    const [cmsExchanger] = await Promise.all([
      loadExchanger(name),
      // loadArticleCodes(),
      // loadPms(),
    ]);

    if (!cmsExchanger) {
      return {
        notFound: true,
      };
    }
    // const enrichedExchanger = await addExchangerCrossLinking(
    //   cmsExchanger,
    //   articleCodes,
    //   pms,
    //   locale
    // );

    //const exchanger = enrichedExchanger || cmsExchanger;

    const title = ` ${locale == "en" ? "Exchanger" : "Обменник"} ${capitalize(
      cmsExchanger.name
    )}`;
    const description = `${capitalize(cmsExchanger.name)}: ${
      locale == "en"
        ? "Exchanger card, rating and info"
        : "Карточка обменника, рейтинг и информация"
    } `;

    const seo = {
      title,
      description,
      canonicalPath: `${locale}/exchangers/${slug}`,
      updatedAt: cmsExchanger.updatedAt || new Date().toISOString(),
      locale,
      alternateLangs: [
        {
          rel: "alternate",
          hrefLang: "en",
          href: `https://p2pie.com/en/exchangers/${slug}`,
        },
        {
          rel: "alternate",
          hrefLang: "ru",
          href: `https://p2pie.com/ru/exchangers/${slug}`,
        },
      ],
    };
    const end = performance.now();
    const time = ((end - start) / 1000).toFixed(2);

    console.log(`Data fetching took ${time} seconds`);
    return {
      props: {
        exchanger: cmsExchanger || null,
        articleCodes: [],
        pms: [],
        seo: seo || nullSeo,
        time,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
    };
  } catch (e) {
    console.error(e);
    return { notFound: true };
  }
}

// Generate paths for each exchanger
export async function getStaticPaths() {
  const exchangers = await loadExchangers();

  if (!exchangers || exchangers.length === 0) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  const locales = ["en", "ru"];

  const paths = exchangers.reduce(
    (
      res: {
        params: { slug: string };
        locale: string;
      }[],
      exchanger: IExchanger
    ) => [
      ...res,
      ...locales.map((locale) => ({
        params: { slug: exchangerNameToSlug(exchanger.name) },
        locale,
      })),
    ],
    []
  );
  return {
    // paths: paths.slice(5),
    paths: paths.slice(
      0,
      20
      // process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      //   ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
      //   : 10000
    ),
    fallback: "blocking", // Use "blocking" to dynamically generate pages on demand
  };
}
