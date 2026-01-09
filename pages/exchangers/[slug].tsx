import { Center } from "@chakra-ui/react";

import Exchanger from "../../components/exchangers/exchanger";
import Loader from "../../components/shared/Loader";
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
  IExchangerReview,
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
import { addHeadersToSearchIndex, addPathsToSitemap } from "../../cache/cache";
import { maskReviewList } from "../../services/maskIP";

const maskExchangerReviewIPs = <
  T extends { reviews?: IExchangerReview[] | null }
>(
  exchanger: T | null
): T | null => {
  if (!exchanger || !Array.isArray(exchanger.reviews)) return exchanger;
  return {
    ...exchanger,
    reviews: maskReviewList(exchanger.reviews),
  } as T;
};

export default function ExchangerPage({
  exchanger,
  seo,
}: {
  exchanger: IExchanger | null;
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
        <Loader size="xl" />
      </Center>
    );
  }

  return <Exchanger exchanger={exchanger} seo={seo} />;
}

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
      console.log(`❌ Exchanger failed to load: ${name}`);
      return { notFound: true };
    }

    const enrichedExchanger = await addExchangerCrossLinking(
      exchanger,
      articleCodes as string[],
      pms as IPm[]
    );

    const displayName = exchanger.display_name || exchanger.name;
    const title = `Обменник ${capitalize(displayName)}`;

    const description = `${capitalize(displayName)}: ${
      "Карточка обменника, рейтинг и информация"
    }`;

    const seo: ISEO = {
      title,
      description,
      canonicalSlug: `exchangers/${slug}`,
      updatedAt: exchanger.updatedAt || new Date().toISOString(),
    };

    await addHeadersToSearchIndex({
      slug: `exchangers/${slug}`,
      header: `Обменник ${capitalize(displayName)}`,
      wordsToSearchFrom: displayName,
    });

    const exchangerWithMaskedIp = maskExchangerReviewIPs(
      enrichedExchanger || exchanger
    );

    return {
      props: {
        exchanger: exchangerWithMaskedIp,
        seo,
      },
      revalidate: TTL.slow,
    };
  } catch (error) {
    console.error("🚨 getStaticProps error:", error);

    return {
      props: {
        exchanger: null,
        seo: nullSeo,
      },
      revalidate: TTL.slow,
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
    await addPathsToSitemap(paths, { basePath: "exchangers" });

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
