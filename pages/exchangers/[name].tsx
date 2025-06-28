import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { IExchanger, IParserExchanger } from "../../types/exchanger";
import { ResponsiveText } from "../../styles/theme/custom";
import {
  addExchangerCrossLinking,
  exchangerNameToSlug,
} from "../../components/exchangers/helper";

import { loadInitialData } from "../../cache/loadInitialData";
import Exchanger from "../../components/exchangers/exchanger";
import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { ISEO } from "../../types/general";
import { getT } from "../../components/shared/getT";
import { nullSeo } from "../../components/shared/UniversalSeo";

export default function ExchangerPage({
  exchanger,
  seo,
}: {
  exchanger: (IExchanger & IParserExchanger) | null;
  seo: ISEO;
}) {
  // Handle non-existent exchanger
  if (!exchanger) {
    return <ResponsiveText>Exchanger not found</ResponsiveText>;
  }
  //mylog(exchanger);

  return <Exchanger exchanger={exchanger} seo={seo} />;
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
    const cachedData = await loadInitialData();
    if (!cachedData || !cachedData.exchangers) {
      return {
        notFound: true,
      };
    }

    const rawExchanger =
      cachedData.exchangers.find(
        (e) => exchangerNameToSlug(e.name) === name.toLowerCase()
      ) || null;

    if (!rawExchanger) {
      return {
        notFound: true,
      };
    }

    const articles = cachedData[`${locale}Data`]?.articles || [];
    const pms = cachedData.pms;

    const enrichedExchanger = await addExchangerCrossLinking(
      rawExchanger,
      articles,
      pms,
      locale
    );

    // Fallback: If description or other enriched data is missing, return minimal data
    const exchanger = enrichedExchanger || rawExchanger;

    const title = ` ${locale == "en" ? "Exchanger" : "Обменник"} ${capitalize(
      exchanger.name
    )}`;
    const description = `${capitalize(exchanger.name)}: ${
      locale == "en"
        ? "Exchanger card, rating and info"
        : "Карточка обменника, рейтинг и информация"
    } `;
    const normalizedCode = exchangerNameToSlug(exchanger.name);

    const t = await getT(locale || "ru");

    const seo = {
      title,
      description,
      canonicalPath: `${locale}/exchangers/${normalizedCode}`,

      updatedAt: exchanger.updatedAt || new Date().toISOString(),
      locale,
      alternateLangs: [
        {
          rel: "alternate",
          hrefLang: "en",
          href: `https://p2pie.com/en/exchangers/${normalizedCode}`,
        },
        {
          rel: "alternate",
          hrefLang: "ru",
          href: `https://p2pie.com/ru/exchangers/${normalizedCode}`,
        },
      ],
    };

    return {
      props: {
        exchanger: exchanger || null,
        seo: seo || nullSeo,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        seo: nullSeo,
        exchanger: null,
        locale,
        ...(await serverSideTranslations(locale || "ru", ["main"])),
      },
    };
  }
}

// Generate paths for each exchanger
export async function getStaticPaths() {
  const cachedData = await loadInitialData();
  const { exchangers } = cachedData || {};

  if (!exchangers || exchangers.length === 0) {
    return {
      paths: [],
      fallback: false,
    };
  }

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
