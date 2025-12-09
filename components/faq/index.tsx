import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Grid,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { BsQuestionCircle } from "react-icons/bs";

import { IFaqCategory } from "../../types/faq";
import { ISEO } from "../../types/general";
import CustomTitle from "../shared/CustomTitle";
import { TextToHTML } from "../shared/helper";
import UniversalSeo from "../shared/UniversalSeo";
import CustomIcon from "./CustomIcon";
import { Box3D } from "../../styles/theme/custom";

export function FaqCategoriesList({
  categories,
}: {
  categories: IFaqCategory[];
}) {
  const accentFallback = useColorModeValue("violet.700", "peach.200");
  const questionColor = useColorModeValue("bg.700", "bg.100");

  return (
    <Grid gridTemplateColumns="1fr 1fr" gridGap={{ base: 2, md: 4 }} mt="2">
      {categories.map((category) => {
        const accent = category.color || accentFallback;

        return (
          <Box3D
            key={category.id}
            p={{ base: 4, md: 6 }}
            variant="contrast"
            h="fit-content"
          >
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

            {category.x_faqs?.length ? (
              <Accordion allowMultiple>
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
                      _expanded={{
                        color: accent,
                        fontWeight: "semibold",
                      }}
                    >
                      <Box flex="1" textAlign="left">
                        <Text fontWeight="semibold" color={questionColor}>
                          {faq.question}
                        </Text>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel
                      px={{ base: 2, md: 3 }}
                      pb={4}
                      color="bg.300"
                    >
                      <TextToHTML
                        text={faq.response}
                        components={{
                          p: ({ children }) => (
                            <Text my="2" color="bg.200">
                              {children}
                            </Text>
                          ),
                          ul: ({ children }) => (
                            <Box as="ul" pl="4" my="2">
                              {children}
                            </Box>
                          ),
                          li: ({ children }) => (
                            <Box as="li" my="1">
                              {children}
                            </Box>
                          ),
                        }}
                      />
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
  return (
    <>
      <UniversalSeo seo={seo} />

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
        <FaqCategoriesList categories={categories} />
      )}
    </>
  );
}
