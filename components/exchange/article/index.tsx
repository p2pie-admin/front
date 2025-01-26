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

const Article = ({
  article,
  code,
  otherDirs,
}: {
  article?: IArticle | null;
  code: string;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
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
          <FaExpandArrowsAlt size="2.5rem" />
          <Heading as="h1" fontSize="5xl">
            {"Что такое " + article.header + "?"}
          </Heading>
        </HStack>
        <Heading as="h2" fontSize="2xl">
          {article.subheader}
        </Heading>

        <Heading as="h3" fontSize="md">{`${timestampToDate(
          article.updatedAt
        )} • ${minToRead} minutes read`}</Heading>

        <Box p="4">
          {refChapters.map((chapter) => (
            <ResponsiveText
              key={"manu:" + chapter.id + chapter.title}
              cursor="pointer"
              fontWeight="bold"
              size="xl"
              color="peach.300"
              _hover={{
                color: "peach.50",
              }}
              whiteSpace="normal"
              onClick={() => executeScroll(chapter.ref)}
            >
              {`${chapter.title}`}
            </ResponsiveText>
          ))}
        </Box>

        <Box>
          {refChapters.map((chapter, idx) => {
            return (
              <Box key={"text:" + chapter.id + chapter.title + idx}>
                <HStack fontSize="lg" fontWeight="bold" mt="4">
                  <Text color="peach.300">#</Text>
                  <Text ref={chapter.ref}>{chapter.title || ""}</Text>
                </HStack>

                <RichText sanitizedHTML={chapter.text} />
                {/* <ReactMarkdown></ReactMarkdown> */}

                {chapter.disclaimer && (
                  <Disclaimer disclaimer={chapter.disclaimer} />
                )}
              </Box>
            );
          })}
        </Box>
        {article.section == "pm" && (
          <OtherDirs code={article.header} otherDirs={otherDirs} />
        )}

        <FoundError />
      </Box3D>
    </>
  );
};

export default Article;
