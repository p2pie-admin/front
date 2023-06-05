import { Box, Grid, Text, useColorModeValue } from "@chakra-ui/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import initFetcher from "../../services/graphql";
import { articleQuery } from "../../services/pageQueries";
import { Box3D } from "../../styles/theme/wrappers";
import { IArticle } from "../../types/pages";

const Article = ({ article }: { article: IArticle }) => {
  const timestampToDate = (ts?: string) => {
    const [y, m, d] = ts ? ts?.split("T")[0]?.split("-") : ["-", "-", "-"];
    return `${d}.${m}.${y}`;
  };
  return (
    <Box
      // p="4"
      // bgColor={useColorModeValue("bg.100", "bg.800")}
      // boxShadow="lg"
      //mt="4"
      // borderRadius="2xl"
      // minH="50vh"
      w={{ base: "98%", md: "70%" }}
      p="4"
    >
      <Text fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
        {article.header}
      </Text>
      <Text fontSize={{ base: "md", md: "xl" }}>{article.subheader}</Text>

      <Grid my="4" borderRadius="xl" gridTemplateColumns="1fr 1fr" gridGap="4">
        <Box>
          <Text color="bg.500"> Contents: </Text>
          <Box p="4">
            {article.chapters.map((chapter) => (
              <Text fontWeight="bold" color="primary.200">
                {`- ${chapter.title}`}
              </Text>
            ))}
          </Box>
        </Box>
        <Text color="bg.500">{`${timestampToDate(article.updatedAt)} • ${
          article.time_to_read
        } minute read`}</Text>
      </Grid>

      <Box>
        {article.chapters.map((chapter) => (
          <>
            <Text fontSize="lg" color="primary.200" mt="4">
              {chapter.title}
            </Text>
            <Text fontSize="md">{chapter.text}</Text>
          </>
        ))}
      </Box>
    </Box>
  );
};

export async function getStaticProps({ locale }: { locale: "en" | "ru" }) {
  const fetcher = initFetcher({
    locale,
    code: "btc",
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
  const paths = [
    // if no `locale` is provided only the defaultLocale will be generated
    { params: { code: "test" }, locale: "en" },
    { params: { code: "test" }, locale: "ru" },
  ];
  return {
    paths,
    fallback: false,
  };
}

export default Article;
