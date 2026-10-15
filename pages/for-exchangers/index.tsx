import Head from "next/head";
import NextLink from "next/link";
import { Box, Heading, Link, Text, VStack } from "@chakra-ui/react";

import { BoxWrapper } from "../../components/shared/BoxWrapper";
import CustomTitle from "../../components/shared/CustomTitle";
import UniversalSeo from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";
import { Locale, tr, useLocale, useT } from "../../services/i18n";

const SUPPORT_EMAIL = "support@p2pie.com";

const buildSeo = (locale: Locale): ISEO => ({
  title: tr(locale, "Для обменников — как попасть в мониторинг P2PIE", "For exchangers — how to get listed on P2PIE"),
  description: tr(
    locale,
    "Условия размещения обменника в мониторинге P2PIE: бесплатно для обменников из BestChange, ExchangeSumo и KursExpert, проверка новых обменников за 0.1 ETH, публикации на наших площадках за 50 USDT.",
    "Listing terms for exchangers on P2PIE: free for exchangers from BestChange, ExchangeSumo and KursExpert, review of new exchangers for 0.1 ETH, posts on our channels for 50 USDT.",
  ),
  canonicalSlug: "for-exchangers",
});

const faq = [
  {
    q: "Сколько стоит попасть в мониторинг?",
    a: "Если обменник уже есть в доверенных мониторингах (BestChange, ExchangeSumo, KursExpert), добавление бесплатное: карточка, логотип, описание, отзывы, история курса и аптайма. Очередь до 7 дней.",
    en_q: "How much does listing cost?",
    en_a: "If the exchanger is already listed on trusted monitorings (BestChange, ExchangeSumo, KursExpert), listing is free: profile card, logo, description, reviews, rate and uptime history. The queue is up to 7 days.",
  },
  {
    q: "Что если обменника нет в известных мониторингах?",
    a: "Нужна проверка за 0.1 ETH: возраст домена, история, отзывы на форумах, чёрные списки и две тестовые покупки с разницей около двух недель. Проверка занимает около трёх недель. Оплата не возвращается независимо от результата: если проверка пройдена, обменник добавляется бесплатно, если нет, в мониторинг он не попадает, а найденные признаки мошенничества мы можем опубликовать.",
    en_q: "What if the exchanger is not on any known monitoring?",
    en_a: "It needs a review for 0.1 ETH: domain age, history, forum reviews, blacklists and two test purchases about two weeks apart. The review takes about three weeks. The fee is not refunded whatever the result: if the review is passed, the exchanger is listed for free; if not, it is not listed, and we may publish any signs of fraud we found.",
  },
  {
    q: "Что входит в публикации за 50 USDT?",
    a: "Материал об обменнике на p2pie.com и его версии на наших площадках (VK, Hive, Mastodon, Telegraph и другие) со ссылками на страницу обменника в мониторинге. Материал помечается как партнёрский. Услуга доступна только обменникам, которые уже есть в мониторинге.",
    en_q: "What do the 50 USDT posts include?",
    en_a: "A post about the exchanger on p2pie.com and its versions on our channels (VK, Hive, Mastodon, Telegraph and others) with links to the exchanger's page in the monitoring. The post is marked as sponsored. Only exchangers already listed in the monitoring can order it.",
  },
  {
    q: "Влияет ли оплата на позицию в таблице?",
    a: "Нет. Таблица всегда сортируется по курсу. Других платных услуг, кроме проверки и публикаций, нет, место в рейтинге не продаётся.",
    en_q: "Does paying affect the position in the table?",
    en_a: "No. The table is always sorted by rate. There are no paid services other than the review and posts; positions in the rating are not for sale.",
  },
  {
    q: "Как оплатить?",
    a: "Проверка оплачивается в ETH, публикации в USDT (TRC-20 или ERC-20). Реквизиты присылаем в ответном письме после согласования.",
    en_q: "How do I pay?",
    en_a: "The review is paid in ETH, posts in USDT (TRC-20 or ERC-20). We send payment details in a reply e-mail once everything is agreed.",
  },
];

const faqJsonLd = (locale: Locale) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map(({ q, a, en_q, en_a }) => ({
    "@type": "Question",
    name: tr(locale, q, en_q),
    acceptedAnswer: { "@type": "Answer", text: tr(locale, a, en_a) },
  })),
});

const H2 = ({ children }: { children: React.ReactNode }) => (
  <Heading as="h2" size="md" my="2" color="bg.100">
    {children}
  </Heading>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <Text color="bg.200">{children}</Text>
);

const ForExchangersPage = () => {
  const locale = useLocale();
  const t = useT();
  return (
  <>
    <UniversalSeo seo={buildSeo(locale)} />
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(locale)) }}
      />
    </Head>

    <CustomTitle
      as="h1"
      title={t("Для обменников", "For exchangers")}
      subtitle={t("Как попасть в мониторинг P2PIE и чем это полезно", "How to get listed on P2PIE and why it helps")}
      my="12"
    />

    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>{t("Что мы делаем", "What we do")}</H2>
          <P>
            {t(
              "P2PIE сравнивает курсы обменников по XML-выгрузкам, следит за доступностью и собирает отзывы. Для каждого обменника мы храним историю курса и аптайма, поэтому пользователи видят, кто реально работает.",
              "P2PIE compares exchanger rates from their XML feeds, monitors availability and collects reviews. We keep rate and uptime history for every exchanger, so users can see who actually works.",
            )}
          </P>

          <H2>{t("Условия размещения", "Listing terms")}</H2>
          <Box as="ul" pl="4" color="bg.200">
            <li>
              <b>{t("Бесплатно", "Free")}</b>{" "}
              {t(
                "— для обменников из BestChange, ExchangeSumo и KursExpert: карточка, логотип, описание, отзывы, история курса и аптайма. Очередь до 7 дней.",
                "— for exchangers from BestChange, ExchangeSumo and KursExpert: profile card, logo, description, reviews, rate and uptime history. The queue is up to 7 days.",
              )}
            </li>
            <li>
              <b>{t("Проверка, 0.1 ETH", "Review, 0.1 ETH")}</b>{" "}
              {t(
                "— для тех, кого нет в известных мониторингах: проверка репутации и две тестовые покупки, около трёх недель. Не возвращается независимо от результата.",
                "— for exchangers not listed on known monitorings: reputation check and two test purchases, about three weeks. Not refunded whatever the result.",
              )}
            </li>
            <li>
              <b>{t("Публикации, 50 USDT", "Posts, 50 USDT")}</b>{" "}
              {t(
                "— материал об обменнике на p2pie.com и наших площадках со ссылками на его страницу в мониторинге. Помечается как партнёрский.",
                "— a post about the exchanger on p2pie.com and our channels with links to its page in the monitoring. Marked as sponsored.",
              )}
            </li>
          </Box>
          <P>
            {t(
              "Всё остальное бесплатно. Место в таблице не продаётся: сортировка всегда идёт по курсу. Будем рады ссылке на вашу страницу в мониторинге в блоке «мы на мониторингах» на вашем сайте.",
              "Everything else is free. Table positions are not for sale: sorting is always by rate. We will appreciate a link to your monitoring page in the “we are on monitorings” block of your website.",
            )}
          </P>

          <H2>{t("Кабинет обменника", "Exchanger dashboard")}</H2>
          <P>
            {t(
              "Мы готовим кабинет, где обменник увидит клики по кнопке «Перейти», позиции по направлениям, аптайм за 30 дней и число отзывов. Кабинет ещё в разработке — расскажем всем участникам, когда он заработает.",
              "We are building a dashboard where an exchanger will see clicks on the “Go” button, positions by exchange direction, 30-day uptime and review count. It is still in development; we will tell all participants when it launches.",
            )}
          </P>

          <H2>{t("Как начать", "How to start")}</H2>
          <P>
            {t("Напишите на", "Write to")}{" "}
            <Link href={`mailto:${SUPPORT_EMAIL}`} color="blue.300">
              {SUPPORT_EMAIL}
            </Link>
            {t(
              ": название обменника, ссылку на XML-выгрузку, сайт и, если есть, ссылки на профили в других мониторингах. Мы ответим по-человечески и без шаблонов. Подробнее об отзывах и правилах — в",
              ": the exchanger name, a link to the XML feed, the website and, if any, links to profiles on other monitorings. We reply like humans, no templates. More about reviews and rules in the",
            )}{" "}
            <Link as={NextLink} href="/faq" color="blue.300">
              FAQ
            </Link>
            .
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>{t("Частые вопросы", "Frequently asked questions")}</H2>
          {faq.map(({ q, a, en_q, en_a }) => (
            <Box key={q}>
              <Heading as="h3" size="sm" color="bg.100">
                {t(q, en_q)}
              </Heading>
              <P>{t(a, en_a)}</P>
            </Box>
          ))}
        </VStack>
      </BoxWrapper>
    </VStack>
  </>
  );
};

export default ForExchangersPage;
