import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsQuestionCircle } from "react-icons/bs";
import { BiSearch } from "react-icons/bi";
import Head from "next/head";
import { useMemo, useState } from "react";

import { IFaqCategory } from "../../types/faq";
import { ISEO } from "../../types/general";
import CustomTitle from "../shared/CustomTitle";
import { TextToHTML } from "../shared/helper";
import UniversalSeo from "../shared/UniversalSeo";
import CustomIcon from "./CustomIcon";
import { Box3D } from "../../styles/theme/custom";
import { IoMdInformationCircle } from "react-icons/io";
import { CustomHeader } from "../shared/BoxWrapper";

const matches = (faq: { question: string; response: string }, q: string) =>
  !q ||
  faq.question.toLowerCase().includes(q) ||
  (faq.response || "").toLowerCase().includes(q);

export function FaqCategoriesList({
  categories,
  customTitle,
  query = "",
  defaultOpenFirst = false,
}: {
  categories: IFaqCategory[];
  customTitle?: string;
  // Lower-cased search string: questions that do not match are hidden, empty categories too.
  query?: string;
  // Open the very first question so the page reads as answers, not a wall of headings.
  defaultOpenFirst?: boolean;
}) {
  const accentFallback = useColorModeValue("violet.700", "peach.200");
  const questionColor = useColorModeValue("bg.700", "bg.100");
  const q = query.trim().toLowerCase();
  const visible = categories
    .map((c) => ({ ...c, x_faqs: (c.x_faqs || []).filter((f) => matches(f, q)) }))
    .filter((c) => c.x_faqs.length || !q);
  if (q && !visible.length) {
    return (
      <Text textAlign="center" color="bg.400" mt="6">
        По запросу «{query}» ничего не найдено.
      </Text>
    );
  }

  return (
    <Grid
      gridTemplateColumns={{ base: "1fr", md: visible.length % 2 ? "1fr" : "1fr 1fr" }}
      gridGap={{ base: 2, md: 4 }}
      mt="2"
    >
      {visible.map((category, categoryIndex) => {
        const accent = category.color || accentFallback;

        return (
          <Box3D
            key={category.id}
            id={`faq-${category.code || category.id}`}
            p={{ base: 4, md: 6 }}
            variant="contrast"
            h="fit-content"
            scrollMarginTop="72px"
          >
            {!customTitle ? (
              <Flex
                align={{ base: "flex-start", md: "center" }}
                gap="3"
                wrap="wrap"
                mb="4"
              >
                <CustomIcon
                  image={category.image}
                  id={category.id}
                  description={category.description}
                />
              </Flex>
            ) : (
              <>
                <CustomHeader text={customTitle} Icon={IoMdInformationCircle} />
                <Divider my="4" />
              </>
            )}

            {category.x_faqs?.length ? (
              <Accordion
                allowMultiple
                defaultIndex={defaultOpenFirst && categoryIndex === 0 && !q ? [0] : []}
              >
                {category.x_faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    border="none"
                    borderRadius="lg"
                    bgColor="rgba(255,255,255,0.02)"
                    _notLast={{ mb: 2 }}
                  >
                    <AccordionButton
                      px={{ base: 2, md: 3 }}
                      py="3"
                      color="bg.200"
                      _expanded={{
                        color: "peach.200",
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="semibold">{faq.question}</Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      px={{ base: 2, md: 3 }}
                      pb={4}
                      color="bg.300"
                    >
                      <Text whiteSpace="pre-line">{faq.response}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Text color="bg.400">Вопросы скоро появятся.</Text>
            )}
          </Box3D>
        );
      })}
    </Grid>
  );
}

export default function FaqPage({
  categories,
  seo,
}: {
  categories: IFaqCategory[] | null;
  seo: ISEO;
}) {
  const [query, setQuery] = useState("");
  const jsonLd = useMemo(() => {
    const items = (categories || []).flatMap((c) => c.x_faqs || []);
    if (!items.length) return null;
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.response },
      })),
    }).replace(/</g, "\\u003c");
  }, [categories]);

  return (
    <>
      <UniversalSeo seo={seo} />
      {jsonLd ? (
        <Head>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        </Head>
      ) : null}

      <CustomTitle
        as="h1"
        title={seo.title || "FAQ"}
        subtitle={
          seo.description ||
          "Ответы на популярные вопросы о сервисе и P2P обменах"
        }
        my="12"
      />

      {!categories?.length ? (
        <Box textAlign="center" color="bg.400" mt="6">
          Пока нет вопросов для отображения.
        </Box>
      ) : (
        <>
          <Box px={{ base: 2, md: 0 }} mb="3">
            <InputGroup>
              <InputLeftElement pointerEvents="none" color="bg.500" h="44px">
                <BiSearch />
              </InputLeftElement>
              <Input
                h="44px"
                placeholder="Найти вопрос…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                borderColor="bg.500"
                _placeholder={{ color: "bg.500" }}
              />
            </InputGroup>
            {!query ? (
              <Box
                overflowX="auto"
                mt="3"
                sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
              >
                <HStack spacing="2" w="max-content">
                  {categories.map((c) => (
                    <Button
                      key={c.id}
                      as="a"
                      href={`#faq-${c.code || c.id}`}
                      size="sm"
                      borderRadius="full"
                      variant="outline"
                      borderColor="bg.500"
                      color="bg.200"
                      flexShrink={0}
                    >
                      {c.description || c.code}
                    </Button>
                  ))}
                </HStack>
              </Box>
            ) : null}
          </Box>
          <FaqCategoriesList categories={categories} query={query} defaultOpenFirst />
        </>
      )}
    </>
  );
}
