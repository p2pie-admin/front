import Head from "next/head";
import NextLink from "next/link";
import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react";

import { BoxWrapper } from "../../components/shared/BoxWrapper";
import CustomTitle from "../../components/shared/CustomTitle";
import UniversalSeo from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";

const SUPPORT_EMAIL = "support@p2pie.com";

const seo: ISEO = {
  title: "Для обменников — как попасть в мониторинг P2PIE",
  description:
    "Условия размещения обменника в мониторинге P2PIE: бесплатно для обменников из BestChange, ExchangeSumo и KursExpert, проверка новых обменников за 0.1 ETH, публикации на наших площадках за 50 USDT.",
  canonicalSlug: "for-exchangers",
};

const faq = [
  {
    q: "Сколько стоит попасть в мониторинг?",
    a: "Если обменник уже есть в доверенных мониторингах (BestChange, ExchangeSumo, KursExpert), добавление бесплатное: карточка, логотип, описание, отзывы, история курса и аптайма. Очередь до 7 дней.",
  },
  {
    q: "Что если обменника нет в известных мониторингах?",
    a: "Нужна проверка за 0.1 ETH: возраст домена, история, отзывы на форумах, чёрные списки и две тестовые покупки с разницей около двух недель. Проверка занимает около трёх недель. Оплата не возвращается независимо от результата: если проверка пройдена, обменник добавляется бесплатно, если нет, в мониторинг он не попадает, а найденные признаки мошенничества мы можем опубликовать.",
  },
  {
    q: "Что входит в публикации за 50 USDT?",
    a: "Материал об обменнике на p2pie.com и его версии на наших площадках (VK, Hive, Mastodon, Telegraph и другие) со ссылками на страницу обменника в мониторинге. Материал помечается как партнёрский. Услуга доступна только обменникам, которые уже есть в мониторинге.",
  },
  {
    q: "Влияет ли оплата на позицию в таблице?",
    a: "Нет. Таблица всегда сортируется по курсу. Других платных услуг, кроме проверки и публикаций, нет, место в рейтинге не продаётся.",
  },
  {
    q: "Как оплатить?",
    a: "Проверка оплачивается в ETH, публикации в USDT (TRC-20 или ERC-20). Реквизиты присылаем в ответном письме после согласования.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const H2 = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h2" size="md" my="2" color="bg.100">
    {children}
  </Heading>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <Text color="bg.200">{children}</Text>
);

const ForExchangersPage = () => (
  <>
    <UniversalSeo seo={seo} />
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </Head>

    <CustomTitle
      as="h1"
      title="Для обменников"
      subtitle="Как попасть в мониторинг P2PIE и чем это полезно"
      my="12"
    />

    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>Что мы делаем</H2>
          <P>
            P2PIE сравнивает курсы обменников по XML-выгрузкам, следит за
            доступностью и собирает отзывы. Для каждого обменника мы храним
            историю курса и аптайма, поэтому пользователи видят, кто реально
            работает.
          </P>

          <H2>Условия размещения</H2>
          <Box as="ul" pl="4" color="bg.200">
            <li>
              <b>Бесплатно</b> — для обменников из BestChange, ExchangeSumo и
              KursExpert: карточка, логотип, описание, отзывы, история курса и
              аптайма. Очередь до 7 дней.
            </li>
            <li>
              <b>Проверка, 0.1 ETH</b> — для тех, кого нет в известных
              мониторингах: проверка репутации и две тестовые покупки, около трёх
              недель. Не возвращается независимо от результата.
            </li>
            <li>
              <b>Публикации, 50 USDT</b> — материал об обменнике на p2pie.com и
              наших площадках со ссылками на его страницу в мониторинге. Помечается
              как партнёрский.
            </li>
          </Box>
          <P>
            Всё остальное бесплатно. Место в таблице не продаётся: сортировка
            всегда идёт по курсу. Будем рады ссылке на вашу страницу в
            мониторинге в блоке «мы на мониторингах» на вашем сайте.
          </P>

          <H2>Кабинет обменника</H2>
          <P>
            Мы готовим кабинет, где обменник увидит клики по кнопке «Перейти»,
            позиции по направлениям, аптайм за 30 дней и число отзывов. Кабинет ещё в разработке — расскажем всем участникам, когда
            он заработает.
          </P>

          <H2>Как начать</H2>
          <P>
            Напишите на{" "}
            <Link href={`mailto:${SUPPORT_EMAIL}`} color="blue.300">
              {SUPPORT_EMAIL}
            </Link>
            : название обменника, ссылку на XML-выгрузку, сайт и, если есть,
            ссылки на профили в других мониторингах. Мы ответим по-человечески
            и без шаблонов. Подробнее об отзывах и правилах — в{" "}
            <Link as={NextLink} href="/faq" color="blue.300">
              FAQ
            </Link>
            .
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>Частые вопросы</H2>
          {faq.map(({ q, a }) => (
            <Box key={q}>
              <Heading as="h3" size="sm" color="bg.100">
                {q}
              </Heading>
              <P>{a}</P>
            </Box>
          ))}
        </VStack>
      </BoxWrapper>
    </VStack>
  </>
);

export default ForExchangersPage;
