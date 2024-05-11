import { Box, HStack, Text } from "@chakra-ui/react";
import Disclaimer from "../../components/shared/article/Disclaimer";
import { initCMSFetcher, initParserFetcher } from "../../services/fetchers";
import { articleCodesQuery, articleQuery } from "../../services/pageQueries";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IArticle } from "../../types/pages";
import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import DefaultDirText from "./DefaultDirText";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { restorePmsFromSlug } from "../../redux/thunks";
import { pmGroupsQuery } from "../../services/initialQueries";
import {
  getPmsFromPmGroup,
  pmsToSlug,
} from "../../components/main/side/selector/section/PmGroup/helper";
import { IPm, IPmGroup } from "../../types/selector";

const Article = ({
  article = null,
  slug,
}: {
  article?: IArticle | null;
  slug: string;
}) => {
  //dispatch(restorePmsFromSlug(slug[0]));

  const timestampToDate = (ts?: string) => {
    const [y, m, d] = ts ? ts?.split("T")[0]?.split("-") : ["-", "-", "-"];
    return `${d}.${m}.${y}`;
  };
  if (!article) return <DefaultDirText slug={slug} />;
  const refChapters = article.chapters.map((chapter) => ({
    ...chapter,
    ref: useRef(null),
  }));

  const executeScroll = (ref: any) =>
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });

  const symbols = article.chapters.reduce(
    (length, chapter) => (length += chapter.text.length),
    0
  );

  const minToRead = Math.round(symbols / 1000);

  return (
    <Box3D maxW="980" px={["2", "4", "8"]} py={["4", "8", "12"]}>
      <DefaultDirText slug={slug} />
      <h1>{article.header}</h1>
      <h2>{article.subheader}</h2>

      <h3>{`${timestampToDate(
        article.updatedAt
      )} • ${minToRead} minutes read`}</h3>

      <Box p="4">
        <ResponsiveText whiteSpace="normal" color="bg.300">
          {" "}
          Contents:{" "}
        </ResponsiveText>

        {refChapters.map((chapter) => (
          <ResponsiveText
            cursor="pointer"
            fontWeight="bold"
            color="peach.200"
            _hover={{
              color: "peach.50",
            }}
            whiteSpace="normal"
            onClick={() => executeScroll(chapter.ref)}
          >
            {`• ${chapter.title}`}
          </ResponsiveText>
        ))}
      </Box>

      <Box>
        {refChapters.map((chapter) => {
          return (
            <>
              <HStack fontSize="lg" fontWeight="bold" mt="4">
                <Text color="peach.200">#</Text>
                <Text ref={chapter.ref}>{chapter.title || ""}</Text>
              </HStack>

              <ReactMarkdown>{chapter.text}</ReactMarkdown>

              {chapter.disclaimer && (
                <Disclaimer disclaimer={chapter.disclaimer} />
              )}
            </>
          );
        })}
      </Box>
    </Box3D>
  );
  // return (
  //   <Box3D>
  //     <ResponsiveText>{dir}</ResponsiveText>
  //     <ResponsiveText>{article?.header}</ResponsiveText>
  //   </Box3D>
  // );
};

let cachedData = null as { id: string; code: string }[] | null;

export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { slug: string };
}) {
  const { slug } = params;
  let article = null;

  // ФЕТЧИМ ТОЛЬКО СПУСТЯ ВРЕМЯ ЧТОБЫ ЗАПРОСИТЬ НАПРАВЛЕНИЯ
  // С СУЩЕСТВУЮЩИМИ АРТИКЛАМИ ТОЛЬКО ОДИН РАЗ
  // И НЕ ЗАГРУЖАТЬ STRAPI

  if (!cachedData) {
    console.log("Fetching new data");
    const dirArticlesFetcher = initCMSFetcher();
    const res = (await dirArticlesFetcher(articleCodesQuery)) as {
      articles: { id: string; code: string }[];
    };
    const { articles } = res;
    cachedData = articles;
  }

  const articleCode = cachedData?.find(
    (a) => a.code.toUpperCase() === slug.toUpperCase()
  )?.code;

  if (articleCode) {
    try {
      const fetcher = initCMSFetcher({
        locale,
        code: articleCode,
      });

      const res = await fetcher(articleQuery);
      article = res?.articles[0] ? (res.articles[0] as IArticle) : null;
    } catch (e) {}
  }

  return {
    props: {
      article,
      slug,
      ...(await serverSideTranslations(locale || "ru", ["article"])),
    },
    revalidate: 36000, // 10h
  };
}

//const tabs = ['tab-1', 'tab-2']; const locales = ['en', 'de']; return { paths: tabs.reduce((arr, tab) => ([...arr, ...locales.map(locale => ({params: {tab}, locale}))]), []), fallback: false }

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
  //["BTC_SBERRUB", "BTC_ETH"];
  console.log("possible dirs: ", dirs);
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

  const slugs = possiblePmPairs.map((pair) => pmsToSlug(pair));
  console.log("slugs length", slugs.length);
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
    fallback: "blocking",
  };
  // const paths = [
  //   // if no `locale` is provided only the defaultLocale will be generated
  //   { params: { code: "test" }, locale: "en" },
  //   { params: { code: "test" }, locale: "ru" },
  // ];
  // return {
  //   paths,
  //   fallback: false,
  // };
}

export default Article;
