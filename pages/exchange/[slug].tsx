import { Box, Flex, Grid, HStack, Text } from "@chakra-ui/react";
import Disclaimer from "../../components/shared/article/Disclaimer";
import { initCMSFetcher, initParserFetcher } from "../../services/fetchers";
import { articleCodesQuery, articleQuery } from "../../services/pageQueries";
import { Box3D, RegularBox, ResponsiveText } from "../../styles/theme/custom";
import { IArticle } from "../../types/pages";
import { useRef } from "react";

import DefaultDirText from "../../components/exchange/DefaultDirText";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { pmGroupsQuery } from "../../services/initialQueries";
import {
  getPmsFromPmGroup,
  pmsToSlug,
} from "../../components/main/side/selector/section/PmGroup/helper";
import { IPm, IPmGroup } from "../../types/selector";

import LimitsRange from "../../components/main/limits";
import TV from "../../components/main/tv";
import Calculator from "../../components/main/Calculator";
import { fetchCCRates, fetchRates, restoreFromSlug } from "../../redux/thunks";
import { useAppDispatch } from "../../redux/hooks";

import { IRate } from "../../types/rates";
import Article from "../../components/exchange/Article";
import { ICurrencyConverterRate } from "../../types/p2p";
import { setInitialData } from "../../redux/mainReducer";
import { ifMobile } from "../../components/exchange/helper";

const Exchange = ({
  article = null,
  slug,
  givePm,
  getPm,
  prerenderedDirRates,
  prerenderedCCRates,
  isMobile,
}: {
  article?: IArticle | null;
  slug?: string;
  givePm: IPm;
  getPm: IPm;
  prerenderedDirRates: IRate[];
  prerenderedCCRates: ICurrencyConverterRate;
  isMobile: boolean;
}) => {
  const dispatch = useAppDispatch();

  dispatch(
    setInitialData({
      dirRates: prerenderedDirRates,
      givePm,
      getPm,
      ccRates: prerenderedCCRates,
    })
  );
  if (!slug) return <></>;
  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: "1fr auto" }}
      gridGap="5"
      maxH={{ base: "unset", md: "700px" }}
      mt={["0", "10"]}
    >
      <RegularBox
        p={[2, 3, 4]}
        variant="no_contrast"
        boxShadow="lg"
        borderRadius="2xl"
        w={{ base: "100%", sm: 432 }}
      >
        <DefaultDirText slug={slug} />
        <Calculator />

        <LimitsRange />
        <TV isMobile={isMobile} />
      </RegularBox>

      <Article article={article} />
    </Grid>
  );
  // return (
  //   <Box3D>
  //     <ResponsiveText>{dir}</ResponsiveText>
  //     <ResponsiveText>{article?.header}</ResponsiveText>
  //   </Box3D>
  // );
};

let cachedData = {} as {
  articleCodes: { id: string; code: string }[];
  popular_dirs: string[];
};

export async function getStaticProps({
  locale,
  params,
  req,
}: {
  locale: "en" | "ru";
  params: { slug: string };
  req: any;
}) {
  try {
    const { slug } = params;
    let article = null;
    // ФЕТЧИМ ТОЛЬКО СПУСТЯ ВРЕМЯ ЧТОБЫ ЗАПРОСИТЬ НАПРАВЛЕНИЯ
    // С СУЩЕСТВУЮЩИМИ АРТИКЛАМИ ТОЛЬКО ОДИН РАЗ
    // И НЕ ЗАГРУЖАТЬ STRAPI
    if (!cachedData.articleCodes) {
      const getAllArticleCodes = initCMSFetcher();
      const res = (await getAllArticleCodes(articleCodesQuery)) as {
        articles: { id: string; code: string }[];
      };
      const { articles } = res;
      cachedData.articleCodes = articles;
    }

    const articleCode = cachedData.articleCodes?.find(
      (a) => a.code.toUpperCase() === slug.toUpperCase()
    )?.code;

    if (articleCode) {
      const fetcher = initCMSFetcher({
        locale,
        code: articleCode,
      });
      const res = await fetcher(articleQuery);
      article = res?.articles[0] ? (res.articles[0] as IArticle) : null;
    }
    const res = await restoreFromSlug(slug);

    const { givePm, getPm } = res;
    const dir = `${givePm?.code}_${getPm?.code}`;
    const curPair = `${givePm?.currency.code}_${getPm?.currency.code}`;
    const prerenderedDirRates = await fetchRates(dir);
    const prerenderedCCRates = (await fetchCCRates({ curPair })).data;

    //const userAgent = req?.headers?.["user-agent"] || "";
    const isMobile = false; //ifMobile(userAgent);

    return {
      props: {
        article,
        slug,
        givePm,
        getPm,
        prerenderedDirRates,
        prerenderedCCRates,
        isMobile,
        ...(await serverSideTranslations(locale || "ru", ["home"])),
      },
      // revalidate: cachedData.articleCodes.find((ac) => ac.code == slug)
      //   ? 3000
      //   : 60000, // sec
    };
  } catch (error) {
    console.error(`Error fetching data for ${params.slug}`, error);
    return {
      notFound: true,
    };
  }
}

///////////////////////////////////////////////////////////////////////////////////////

export async function getStaticPaths() {
  const possiblePairsFetcher = initParserFetcher();
  const ppRes = (await possiblePairsFetcher("possible_pairs")) as {
    [key: string]: string[];
  };
  const dirs = Object.entries(ppRes).reduce(
    (res: string[], [code, pairs]) => [
      ...res,
      ...pairs.map((pair) => `${code}_${pair}`),
    ],
    []
  );

  const filteredDirs = dirs.filter(
    (dir) => dir.includes("BTC") && dir.includes("RUB")
  );
  //["BTC_SBERRUB", "BTC_ETH"];
  const pmGroupsFetcher = initCMSFetcher();
  const { pmGroups } = (await pmGroupsFetcher(pmGroupsQuery)) as {
    pmGroups: IPmGroup[];
  };

  const pms = pmGroups.reduce(
    (res: IPm[], pmGroup: IPmGroup) => [...res, ...getPmsFromPmGroup(pmGroup)],
    []
  );

  const possiblePmPairs = dirs.map((dir) => ({
    givePm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[0]),
    getPm: pms.find((pm) => pm.code.toUpperCase() === dir.split("_")[1]),
  }));

  const slugs = possiblePmPairs.map((pair) => pmsToSlug(pair)).slice(0, 100);

  const locales = ["en", "ru"];

  return {
    paths: slugs.reduce(
      (arr: { params: { slug: string }; locale: string }[], slug: string) => [
        ...arr,
        ...locales.map((locale) => ({
          params: {
            slug,
          },
          locale,
        })),
      ],
      []
    ),
    fallback: true,
  };
}

export default Exchange;
