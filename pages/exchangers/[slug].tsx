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
  params: { slug: string };
}) {
  try {
    const { slug } = params;
    const name = exchangerSlugToName(slug);
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

    // const exchanger = enrichedExchanger || cmsExchanger;

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
    return {
      props: {
        exchanger: cmsExchanger || null,
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
  const exchangers = await loadExchangers();

  if (!exchangers || exchangers.length === 0) {
    return {
      paths: [],
      fallback: true,
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
      process.env.NEXT_PUBLIC_PRERENDER_LIMIT
        ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
        : 10000
    ),
    fallback: true, // Use "blocking" to dynamically generate pages on demand
  };
}
