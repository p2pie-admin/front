import { HStack, Box, Text } from "@chakra-ui/react";

import { useRef } from "react";
import Disclaimer from "../../components/shared/article/Disclaimer";
import { Box3D, ResponsiveText } from "../../styles/theme/custom";
import { IArticle } from "../../types/pages";
import DefaultDirText from "./DefaultDirText";

const Article = ({ article }: { article?: IArticle | null }) => {
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
    <Box3D
      variant="no_contrast"
      maxW={{ base: "432px", md: "calc(980px - 432px - 20px)" }}
      px={["2", "4", "8"]}
      py={["4", "8", "12"]}
    >
      <h1>{article.header}</h1>
      <h2>{article.subheader}</h2>

      <h3>{`${timestampToDate(
        article.updatedAt
      )} • ${minToRead} minutes read`}</h3>

      <Box p="4">
        <ResponsiveText whiteSpace="normal" color="bg.300">
          Contents:
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

              {/* <ReactMarkdown>{chapter.text}</ReactMarkdown> */}

              {chapter.disclaimer && (
                <Disclaimer disclaimer={chapter.disclaimer} />
              )}
            </>
          );
        })}
      </Box>
    </Box3D>
  );
};

export default Article;
