import { HStack, Box, Text, Heading, Flex, Center } from "@chakra-ui/react";

import { useRef, useState } from "react";
import Disclaimer from "../../shared/article/Disclaimer";
import { Box3D, ResponsiveText } from "../../../styles/theme/custom";
import { IArticle } from "../../../types/pages";
//import ReactMarkdown from "react-markdown";
import { FaExpandArrowsAlt } from "react-icons/fa";
import { BsTelegram } from "react-icons/bs";

import FoundError from "./FoundError";
import OtherDirs from "./OtherDirs";
import { IPmPairs } from "../../../types/exchange";
import { useRouter } from "next/router";
import RichText from "../../shared/article/RichText";
import CircularIcon from "../../shared/CircularIcon";
import Stats from "./Stats";

const Article = ({
  article,
  otherDirs,
}: {
  article?: IArticle | null;
  otherDirs: { buy: IPmPairs[]; sell: IPmPairs[] };
}) => {
  const [highlited, setHighlited] = useState(undefined);
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

  const executeScroll = (ref: any) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlited(ref);
  };

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
        <Center w="100%" gap="2" mb="6">
          <Box
            border="1px solid"
            bgColor="bg.700"
            borderColor="bg.600"
            borderRadius="50%"
            w="3"
            h="3"
          />
          <Box
            border="1.5px solid"
            bgColor="bg.600"
            borderColor="bg.500"
            borderRadius="50%"
            w="4"
            h="4"
          />
          <Box
            border="2px solid"
            bgColor="bg.500"
            borderColor="bg.400"
            borderRadius="50%"
            w="5"
            h="5"
          />
          <CircularIcon
            iconAlt={pm.en_name}
            icon={pm.icon}
            color={pm.color || "gray"}
            size="lg"
          />
          <Box
            border="2px solid"
            bgColor="bg.500"
            borderColor="bg.400"
            borderRadius="50%"
            w="5"
            h="5"
          />
          <Box
            border="1.5px solid"
            bgColor="bg.600"
            borderColor="bg.500"
            borderRadius="50%"
            w="4"
            h="4"
          />
          <Box
            border="1px solid"
            bgColor="bg.700"
            borderColor="bg.600"
            borderRadius="50%"
            w="3"
            h="3"
          />
        </Center>

        <Heading as="h1" fontSize={["xl", "2xl", "3xl"]}>
          {article.header}
        </Heading>

        <Heading as="h2" fontSize={["lg", "xl"]}>
          {article.subheader}
        </Heading>

        <ResponsiveText fontSize="md">{`${timestampToDate(
          article.updatedAt
        )} • ${minToRead} minutes read`}</ResponsiveText>

        <Stats stats={article.stats} />

        <Box>
          {refChapters.map((chapter, idx) => (
            <ResponsiveText
              key={"chapterHeader:" + idx}
              cursor="pointer"
              fontWeight="bold"
              size={"lg"}
              color="peach.300"
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
          {refChapters.map((chapter, idx) => {
            return (
              <Box key={"chapter:" + idx}>
                <HStack fontSize={["md", "lg"]} fontWeight="bold" mt="4">
                  <Text color="peach.300">#</Text>
                  <Text
                    ref={chapter.ref}
                    color={chapter.ref == highlited ? "peach.300" : "unset"}
                  >
                    {chapter.title || ""}
                  </Text>
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
