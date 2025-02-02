import { HStack, Box, Text, Heading } from "@chakra-ui/react";

import { useRef } from "react";
import Disclaimer from "../../shared/article/Disclaimer";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { IArticle } from "../../../types/pages";
//import ReactMarkdown from "react-markdown";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";

import FoundError from "./FoundError";
import OtherDirs from "./OtherDirs";
import { IPm } from "../../../types/selector";
import { IPmPairs } from "../../../types/exchange";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";
import RichText from "../../shared/article/RichText";
import header from "../../layout/header";
import CircularIcon from "../../shared/CircularIcon";

const Article = ({
  article,
  otherDirs,
}: {
  article?: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
  const { locale } = useRouter() as { locale: "en" | "ru" };
  const timestampToDate = (ts?: string) => {
    const [y, m, d] = ts ? ts?.split("T")[0]?.split("-") : ["-", "-", "-"];
    return `${d}.${m}.${y}`;
  };
  if (!article) return <></>;

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

  const pm = otherDirs.buy[0].givePm;
  const pmName = pm?.[`${locale}_name`] + " " + pm?.code;
  if (!pm) return <>Nothing was found!</>;
  return (
    <>
      <Box3D
        variant="contrast"
        w="100%"
        mt={["2", "8"]}
        px={["2", "8"]}
        py={["4", "8"]}
      >
        <HStack>
          <CircularIcon
            iconAlt={pm.en_name}
            icon={pm.icon}
            color={pm.color || "gray"}
            size="lg"
          />
          <Heading as="h1" fontSize="3xl">
            {article.header}
          </Heading>
        </HStack>
        <Heading as="h2" fontSize="xl">
          {article.subheader}
        </Heading>

        <ResponsiveText fontSize="md">{`${timestampToDate(
          article.updatedAt
        )} • ${minToRead} minutes read`}</ResponsiveText>

        <Box p="4">
          {refChapters.map((chapter, idx) => (
            <ResponsiveText
              key={"chapterHeader:" + idx}
              cursor="pointer"
              fontWeight="bold"
              size="lg"
              color="peach.300"
              _hover={{
                color: "peach.50",
              }}
              whiteSpace="normal"
              onClick={() => executeScroll(chapter.ref)}
            >
              {`- ${chapter.title}`}
            </ResponsiveText>
          ))}
        </Box>

        <Box>
          {refChapters.map((chapter, idx) => {
            return (
              <Box key={"chapter:" + idx}>
                <HStack fontSize="lg" fontWeight="bold" mt="4">
                  <Text color="peach.300">#</Text>
                  <Text ref={chapter.ref}>{chapter.title || ""}</Text>
                </HStack>

                <RichText sanitizedHTML={chapter.text} />
                {/* <ReactMarkdown></ReactMarkdown> */}

                {/* {chapter.disclaimer && (
                  <Disclaimer disclaimer={chapter.disclaimer} />
                )} */}
              </Box>
            );
          })}
        </Box>

        <OtherDirs pmName={pmName} otherDirs={otherDirs} />

        <FoundError />
      </Box3D>
    </>
  );
};

export default Article;
