import { Box, Button, Grid, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { BsTelegram } from "react-icons/bs";
import { TbBuildingStore, TbUsers, TbChartLine } from "react-icons/tb";
import { loadArticle, loadFAQbyCategoryCode, TTL } from "../../cache/loadX";
import { ISEO } from "../../types/general";
import { IFaqCategory } from "../../types/faq";
import { IArticle } from "../../types/pages";
import UniversalSeo from "../../components/shared/UniversalSeo";
import CustomTitle from "../../components/shared/CustomTitle";
import { FaqCategoriesList } from "../../components/faq";
import { BoxWrapper } from "../../components/shared/BoxWrapper";
import { TextToHTML } from "../../components/shared/helper";
import { Box3D } from "../../styles/theme/custom";

const PAGE_CODE = "partnership";
const SUPPORT_EMAIL = "support@p2pie.com";

const buildSeo = (article: IArticle | null): ISEO => ({
  title:
    article?.seo_title ||
    `Партнёрство с ${process.env.NEXT_PUBLIC_NAME || "p2pie"} — обменникам, партнёрам, СМИ`,
  description:
    article?.seo_description ||
    "Как сотрудничать с p2pie: размещение обменника в мониторинге, вознаграждение за приведённых обменников, данные о курсах для СМИ и разработчиков.",
  canonicalSlug: PAGE_CODE,
  updatedAt: article?.updatedAt ?? null,
});

const OPTIONS = [
  {
    icon: TbBuildingStore,
    title: "Обменникам",
    text: "Бесплатное размещение для обменников из доверенных мониторингов, быстрый запуск за 50 USDT, бейдж «Залог» для тех, кто внёс гарантийный депозит. Позиция в таблице не продаётся — сортировка всегда по курсу.",
    cta: { label: "Условия для обменников", href: "/for-exchangers" },
  },
  {
    icon: TbUsers,
    title: "Партнёрам и вебмастерам",
    text: "Приведите обменник в мониторинг — вознаграждение с каждой оплаченной услуги обсуждаем индивидуально. Обзоры, сравнения и ссылки на p2pie с живыми курсами приветствуются.",
    cta: { label: "Написать нам", href: `mailto:${SUPPORT_EMAIL}` },
  },
  {
    icon: TbChartLine,
    title: "СМИ, блогерам и разработчикам",
    text: "Делимся данными: текущие курсы по направлениям, история лучшего курса за 45 дней, доступность обменников. Для публикаций — с указанием p2pie как источника.",
    cta: { label: "Запросить данные", href: `mailto:${SUPPORT_EMAIL}` },
  },
];

const PartnershipPage = ({
  article,
  faqCategory,
  seo,
}: {
  article: IArticle | null;
  faqCategory: IFaqCategory | null;
  seo: ISEO;
}) => {
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_CHAT || "https://t.me/p2pie";
  return (
    <>
      <UniversalSeo seo={seo} />

      <CustomTitle
        as="h1"
        title={article?.header || "Партнёрство с p2pie"}
        subtitle={
          article?.subheader ||
          "Три способа сотрудничать: размещение обменника, партнёрская программа, данные о курсах"
        }
        my={{ base: 8, lg: 12 }}
      />

      <Grid
        gridTemplateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={{ base: 3, md: 4 }}
        px={{ base: 2, md: 0 }}
        w="100%"
      >
        {OPTIONS.map((o) => (
          <Box3D key={o.title} variant="contrast" p={{ base: 4, md: 5 }} display="flex" flexDir="column">
            <HStack spacing="3" mb="2" color="peach.300">
              <Icon as={o.icon} boxSize="6" />
              <Heading as="h2" fontSize="lg" color="bg.100">
                {o.title}
              </Heading>
            </HStack>
            <Text fontSize="sm" color="bg.300" flex="1" lineHeight="1.6">
              {o.text}
            </Text>
            <Box mt="4">
              {o.cta.href.startsWith("/") ? (
                <Button as={NextLink} href={o.cta.href} prefetch={false} size="sm" variant="outline" borderColor="bg.500" color="bg.200" w="100%">
                  {o.cta.label}
                </Button>
              ) : (
                <Button as="a" href={o.cta.href} size="sm" variant="outline" borderColor="bg.500" color="bg.200" w="100%">
                  {o.cta.label}
                </Button>
              )}
            </Box>
          </Box3D>
        ))}
      </Grid>

      <VStack spacing="3" mt="8" px={{ base: 2, md: 0 }}>
        <Text fontSize="sm" color="bg.400" textAlign="center">
          Отвечаем по-человечески и без шаблонов: Telegram — в течение нескольких часов, почта — 1–2 рабочих дня.
        </Text>
        <HStack spacing="3" flexWrap="wrap" justifyContent="center">
          <Button as="a" href={telegram} target="_blank" rel="noopener noreferrer" variant="primary" color="white" leftIcon={<BsTelegram />}>
            Написать в Telegram
          </Button>
          <Button as="a" href={`mailto:${SUPPORT_EMAIL}`} variant="outline" borderColor="bg.500" color="bg.200">
            {SUPPORT_EMAIL}
          </Button>
        </HStack>
      </VStack>

      <VStack spacing={{ base: 4, md: 6 }} align="stretch" mt="8">
        {article?.text ? (
          <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
            <TextToHTML
              text={article.text}
              components={{
                p: ({ children }: any) => (
                  <Text my="2" color="bg.200">
                    {children}
                  </Text>
                ),
                h2: ({ children }: any) => (
                  <Heading as="h2" size="md" my="4" color="bg.100">
                    {children}
                  </Heading>
                ),
              }}
            />
          </BoxWrapper>
        ) : null}
        {faqCategory ? <FaqCategoriesList categories={[faqCategory]} /> : null}
      </VStack>
    </>
  );
};

const emptyProps = async () => ({
  props: {
    article: null,
    faqCategory: null,
    seo: buildSeo(null),
  },
  revalidate: TTL.slowest,
});

export const getStaticProps = async () => {
  try {
    const [article, faqCategory] = await Promise.all([
      loadArticle(PAGE_CODE),
      loadFAQbyCategoryCode(PAGE_CODE),
    ]);

    return {
      props: {
        article: article || null,
        faqCategory: faqCategory || null,
        seo: buildSeo(article),
      },
      revalidate: TTL.slowest,
    };
  } catch (e) {
    console.error("[partnership] getStaticProps error:", e);
    return emptyProps();
  }
};

export default PartnershipPage;
