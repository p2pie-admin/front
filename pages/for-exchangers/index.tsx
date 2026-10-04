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
    "Условия размещения обменника в мониторинге P2PIE: бесплатное добавление, быстрый запуск, проверка и гарантийный депозит с бейджем «Залог».",
  canonicalSlug: "for-exchangers",
};

const faq = [
  {
    q: "Сколько стоит попасть в мониторинг?",
    a: "Если обменник уже есть в доверенных мониторингах (BestChange, ExchangeSumo, KursExpert), добавление бесплатное, очередь до 7 дней. Быстрый запуск в тот же день стоит 50 USDT.",
  },
  {
    q: "Что если обменника нет в известных мониторингах?",
    a: "Нужна проверка: мы делаем две тестовые покупки. Стоимость проверки — 200 USDT, она не возвращается. После проверки обменник добавляется с гарантийным депозитом.",
  },
  {
    q: "Что такое депозит и бейдж «Залог»?",
    a: "Это добровольный (для прошедших проверку новичков — обязательный) взнос 300 USDT. Он показывает пользователям, что обменник готов отвечать деньгами за свои обязательства. Депозит возвращается через 30 дней после выхода из мониторинга, если нет открытых претензий.",
  },
  {
    q: "Влияет ли оплата на позицию в таблице?",
    a: "Нет. Таблица всегда сортируется по курсу. Платные услуги не покупают место в рейтинге.",
  },
  {
    q: "Как оплатить?",
    a: "USDT (TRC-20 или ERC-20) или ETH. Реквизиты мы присылаем в ответном письме после согласования условий.",
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
              <b>Бесплатно</b> — для обменников из доверенных мониторингов,
              очередь до 7 дней.
            </li>
            <li>
              <b>Быстрый запуск, 50 USDT</b> — в тот же день: карточка, описание,
              логотип.
            </li>
            <li>
              <b>Проверка, 200 USDT</b> — для тех, кого нет в известных
              мониторингах: две тестовые покупки.
            </li>
            <li>
              <b>Гарантийный депозит, 300 USDT</b> — бейдж «Залог» на карточке
              и в таблице предложений. Возвращается через 30 дней после выхода
              из мониторинга, если нет открытых претензий.
            </li>
          </Box>
          <P>
            Платное размещение в таблице не продаётся: сортировка всегда идёт по
            курсу.
          </P>

          <H2>Кабинет обменника</H2>
          <P>
            Мы готовим кабинет, где обменник увидит клики по кнопке «Перейти»,
            позиции по направлениям, аптайм за 30 дней, число отзывов и баланс
            депозита. Кабинет ещё в разработке — расскажем всем участникам, когда
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
