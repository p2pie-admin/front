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

const Article = ({
  article = null,
  dir,
}: {
  article?: IArticle | null;
  dir: string;
}) => {
  const timestampToDate = (ts?: string) => {
    const [y, m, d] = ts ? ts?.split("T")[0]?.split("-") : ["-", "-", "-"];
    return `${d}.${m}.${y}`;
  };
  if (!article) return <DefaultDirText dir={dir} />;
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
      <DefaultDirText dir={dir} />
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
  params: { dir: string };
}) {
  const { dir } = params;
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
    (a) => a.code.toUpperCase() === dir.toUpperCase()
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
      dir,
      ...(await serverSideTranslations(locale || "ru", ["article"])),
    },
    revalidate: 3600, // 1h
  };
}

//const tabs = ['tab-1', 'tab-2']; const locales = ['en', 'de']; return { paths: tabs.reduce((arr, tab) => ([...arr, ...locales.map(locale => ({params: {tab}, locale}))]), []), fallback: false }

export async function getStaticPaths() {
  const possiblePairsFetcher = initParserFetcher();
  const res = (await possiblePairsFetcher("possible_pairs")) as {
    [key: string]: string[];
  };
  const dirs = Object.entries(res).reduce(
    (res: string[], [code, pairs]) => [
      ...res,
      ...pairs.map((pair) => `${code}_${pair}`),
    ],
    []
  );

  //const testDirs = ["BTC_SBERRUB", "BTC_ETH"];

  const locales = ["en", "ru"];

  return {
    paths: dirs.slice(0, 40).reduce(
      (arr: { params: { dir: string }; locale: string }[], dir: string) => [
        ...arr,
        ...locales.map((locale) => ({
          params: {
            dir,
          },
          locale,
        })),
      ],
      []
    ),
    fallback: false,
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
