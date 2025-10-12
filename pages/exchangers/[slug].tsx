import { Center, Spinner } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Exchanger from "../../components/exchangers/exchanger";
import {
  exchangerSlugToName,
  addExchangerCrossLinking,
  exchangerNameToSlug,
} from "../../components/exchangers/helper";
import { capitalize } from "../../components/main/side/selector/section/PmGroup/helper";
import { nullSeo } from "../../components/shared/UniversalSeo";

import {
  IExchanger,
  IExchangerPreview,
  IParserExchanger,
} from "../../types/exchanger";
import { ISEO } from "../../types/general";
import { IPm } from "../../types/selector";
import {
  loadArticleCodes,
  loadExchanger,
  loadExchangers,
  loadPms,
  TTL,
} from "../../cache/loadX";
import { addPathsToSitemap } from "../../cache/cache";

export default function ExchangerPage({
  exchanger,
  seo,
}: {
  exchanger: (IExchanger & IParserExchanger) | null;
  seo: ISEO;
}) {
  if (!exchanger) {
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

  return <Exchanger exchanger={exchanger} seo={seo} />;
}

const locale = (process.env.NEXT_PUBLIC_SITE_LANG || "ru") as "en" | "ru";

// Single-locale getStaticProps
export async function getStaticProps({ params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const name = exchangerSlugToName(slug);

    const [exchanger, articleCodes, pms] = await Promise.all([
      loadExchanger(slug),
      loadArticleCodes(),
      loadPms(),
    ]);

    if (!exchanger) {
      console.log(`❌ Exchanger not found: ${name}`);
      return { notFound: true };
    }

    const enrichedExchanger = await addExchangerCrossLinking(
      exchanger,
      articleCodes as string[],
      pms as IPm[],
      locale
    );

    const title = `${locale === "en" ? "Exchanger" : "Обменник"} ${capitalize(
      exchanger.name
    )}`;

    const description = `${capitalize(exchanger.name)}: ${
      locale === "en"
        ? "Exchanger card, rating and info"
        : "Карточка обменника, рейтинг и информация"
    }`;

    const seo: ISEO = {
      title,
      description,
      canonicalPath: `exchangers/${slug}`, // ❌ no leading slash, ❌ no locale
      updatedAt: exchanger.updatedAt || new Date().toISOString(),
      locale, // you can keep this internally if needed, but it won't affect URLs
    };

    return {
      props: {
        exchanger: enrichedExchanger || exchanger,
        seo,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: TTL.fast,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);

    return {
      props: {
        exchanger: null,
        seo: nullSeo,
        locale,
        ...(await serverSideTranslations(locale, ["main"])),
      },
      revalidate: 60,
    };
  }
}

// Single-locale getStaticPaths
export async function getStaticPaths() {
  try {
    const exchangers = (await loadExchangers()) as IExchangerPreview[];
    if (!exchangers || !Array.isArray(exchangers)) {
      console.warn("⚠️ No exchangers found, returning empty paths");
      return {
        paths: [],
        fallback: false,
      };
    }

    const paths = exchangers.map((exchanger) => ({
      params: { slug: exchangerNameToSlug(exchanger.name) },
    }));

    const prerenderLimit = process.env.NEXT_PUBLIC_PRERENDER_LIMIT
      ? Number(process.env.NEXT_PUBLIC_PRERENDER_LIMIT)
      : 5000;

    const slicedPaths = paths.slice(0, prerenderLimit);
    await addPathsToSitemap(slicedPaths);

    return {
      paths: slicedPaths,
      fallback: "blocking",
    };
  } catch (error) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
