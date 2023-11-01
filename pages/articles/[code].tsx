import {
  Box,
  Grid,
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import Disclaimer from "../../components/shared/article/Disclaimer";
import { initCMSFetcher } from "../../services/fetchers";
import { articleCodesQuery, articleQuery } from "../../services/pageQueries";
import { Box3D } from "../../styles/theme/custom";
import { IArticle } from "../../types/pages";
import ReactMarkdown from "react-markdown";
import { useRef } from "react";

const Article = ({ article }: { article: IArticle }) => {
  const timestampToDate = (ts?: string) => {
    const [y, m, d] = ts ? ts?.split("T")[0]?.split("-") : ["-", "-", "-"];
    return `${d}.${m}.${y}`;
  };

  const refChapters = article.chapters.map((chapter) => ({
    ...chapter,
    ref: useRef(null),
  }));

  const executeScroll = (ref: any) =>
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
  //https://dev.to/
  return (
    <Box>
      <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold">
        {article.header}
      </Text>
      <Text fontSize={{ base: "md", md: "xl" }} color="bg.300">
        {article.subheader}
      </Text>

      <Text fontSize="sm" color="bg.500">{`${timestampToDate(
        article.updatedAt
      )} • ${article.time_to_read} minute read`}</Text>

      <Box p="4">
        <Text color="bg.300"> Contents: </Text>

        {refChapters.map((chapter) => (
          <Text
            cursor="pointer"
            fontWeight="bold"
            color="peach.200"
            _hover={{
              color: "peach.50",
            }}
            onClick={() => executeScroll(chapter.ref)}
          >
            {`• ${chapter.title}`}
          </Text>
        ))}
      </Box>

      <Box>
        {refChapters.map((chapter) => {
          return (
            <>
              <HStack fontSize="lg" fontWeight="bold">
                <Text color="peach.200">#</Text>
                <Text mt="4" ref={chapter.ref}>
                  {chapter.title || ""}
                </Text>
              </HStack>
              <Box py="1" color="bg.300">
                <ReactMarkdown>{chapter.text}</ReactMarkdown>
              </Box>
              {chapter.disclaimer && (
                <Disclaimer disclaimer={chapter.disclaimer} />
              )}
            </>
          );
        })}
      </Box>
    </Box>
  );
};

export async function getStaticProps({
  locale,
  params,
}: {
  locale: "en" | "ru";
  params: { code: string };
}) {
  const fetcher = initCMSFetcher({
    locale,
    code: params.code,
  });
  const res = await fetcher(articleQuery);

  const { articles } = res;

  return {
    props: {
      article: articles[0],
    },
  };
}

//const tabs = ['tab-1', 'tab-2']; const locales = ['en', 'de']; return { paths: tabs.reduce((arr, tab) => ([...arr, ...locales.map(locale => ({params: {tab}, locale}))]), []), fallback: false }

export async function getStaticPaths() {
  const fetcher = initCMSFetcher();
  const res = await fetcher(articleCodesQuery);

  const codes = res.articles.map((a: any) => a.code);
  const locales = ["en", "ru"];
  return {
    paths: codes.reduce(
      (arr: { params: { code: string }; locale: string }[], code: string) => [
        ...arr,
        ...locales.map((locale) => ({ params: { code }, locale })),
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
