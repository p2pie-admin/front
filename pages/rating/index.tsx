import Head from "next/head";
import NextLink from "next/link";
import { Box, Flex, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

import { BoxWrapper } from "../../components/shared/BoxWrapper";
import CustomTitle from "../../components/shared/CustomTitle";
import UniversalSeo from "../../components/shared/UniversalSeo";
import TrustBadge from "../../components/shared/TrustBadge";
import { ITrustLevel, TRUST_LEVELS, trustHint } from "../../components/shared/trust";
import { ISEO } from "../../types/general";
import { Locale, tr, useLocale, useT } from "../../services/i18n";

// Public description of the method implemented in competitors/src/core/rating.ts.
// Every number here mirrors a constant there: change both together and bump the version line.
const METHOD_VERSION = "версия 1 от 9 октября 2026";
const EN_METHOD_VERSION = "version 1 of October 9, 2026";
const SUPPORT_EMAIL = "support@p2pie.com";

const buildSeo = (locale: Locale): ISEO => ({
  title: tr(locale, "Как считается рейтинг обменников на P2PIE", "How the exchanger rating on P2PIE works"),
  description: tr(
    locale,
    "Два показателя обменника на P2PIE: оценка клиентов по отзывам с мониторингов и уровень доверия по объёму отзывов, возрасту, присутствию на площадках и нашей проверке. Формулы, веса и примеры.",
    "Two exchanger scores on P2PIE: the customer rating from monitoring reviews and the trust level based on review volume, age, presence on monitorings and our own check. Formulas, weights and examples.",
  ),
  canonicalSlug: "rating",
});

const levels: { level: ITrustLevel; when: string; en_when: string }[] = [
  { level: "reliable", when: "70 баллов и больше", en_when: "70 points or more" },
  { level: "verified", when: "от 45 до 69 баллов", en_when: "45 to 69 points" },
  { level: "unknown", when: "меньше 45 баллов", en_when: "less than 45 points" },
  {
    level: "caution",
    when: "есть серьёзный негативный сигнал, сколько бы баллов ни набралось",
    en_when: "there is a serious negative signal, whatever the points",
  },
];

const factors = [
  {
    name: "Отзывы",
    max: "до 30",
    text: "Сколько отзывов набралось на всех площадках. Шкала логарифмическая: 10 отзывов дают около 10 баллов, 100 дают 20, тысяча и больше дают все 30.",
    en_name: "Reviews",
    en_max: "up to 30",
    en_text: "How many reviews there are across all platforms. The scale is logarithmic: 10 reviews give about 10 points, 100 give 20, a thousand or more give the full 30.",
  },
  {
    name: "Возраст",
    max: "до 25",
    text: "Сколько обменник работает по данным мониторингов и нашей карточки. Полный балл за 5 лет, до этого пропорционально.",
    en_name: "Age",
    en_max: "up to 25",
    en_text: "How long the exchanger has been operating according to monitorings and our profile card. Full points for 5 years, proportional before that.",
  },
  {
    name: "Мониторинги",
    max: "до 20",
    text: "Присутствие на независимых площадках: 10 баллов за BestChange и по 5 за каждую другую, но не больше 10.",
    en_name: "Monitorings",
    en_max: "up to 20",
    en_text: "Presence on independent platforms: 10 points for BestChange and 5 for each other one, but no more than 10.",
  },
  {
    name: "Проверка P2PIE",
    max: "до 15",
    text: "Наш собственный разбор: домен, история бренда, чёрные списки, жалобы на форумах. Положительный итог даёт 15 баллов, итог с оговорками 5, отрицательный снимает 25.",
    en_name: "P2PIE check",
    en_max: "up to 15",
    en_text: "Our own review: domain, brand history, blacklists, forum complaints. A positive result gives 15 points, a result with reservations 5, a negative one takes away 25.",
  },
  {
    name: "Курсы сейчас",
    max: "10",
    text: "Обменник отдаёт курсы и наш парсер получает их прямо сейчас.",
    en_name: "Live rates",
    en_max: "10",
    en_text: "The exchanger publishes rates and our parser is receiving them right now.",
  },
  {
    name: "Штрафы",
    max: "до −35",
    text: "Минус 5 за каждую открытую претензию на мониторинге (не больше 15). Минус 10, если отрицательных отзывов больше 2 %, и минус 20, если больше 10 %.",
    en_name: "Penalties",
    en_max: "down to −35",
    en_text: "Minus 5 for each open claim on a monitoring (no more than 15). Minus 10 if negative reviews exceed 2%, and minus 20 if they exceed 10%.",
  },
];

const examples = [
  {
    title: "1 положительный отзыв",
    stars: "4,42",
    note: "Почти как у новичка без отзывов: один отзыв ничего не доказывает.",
    en_title: "1 positive review",
    en_stars: "4.42",
    en_note: "Almost the same as a newcomer with no reviews: one review proves nothing.",
  },
  {
    title: "400 положительных и 1 отрицательный",
    stars: "4,87",
    note: "Большой объём перевешивает единичную жалобу.",
    en_title: "400 positive and 1 negative",
    en_stars: "4.87",
    en_note: "A large volume outweighs a single complaint.",
  },
  {
    title: "20 положительных и 4 отрицательных",
    stars: "3,02",
    note: "Каждая шестая сделка закончилась жалобой, и оценка это показывает.",
    en_title: "20 positive and 4 negative",
    en_stars: "3.02",
    en_note: "Every sixth deal ended with a complaint, and the rating shows it.",
  },
];

const faq = [
  {
    q: "Почему у обменника с идеальными отзывами не 5 звёзд?",
    a: "Оценка сглаживается: пока отзывов мало, она держится около среднего уровня 4,4. Один или два хвалебных отзыва не поднимают её до максимума, для этого нужны сотни отзывов без жалоб.",
    en_q: "Why doesn't an exchanger with perfect reviews have 5 stars?",
    en_a: "The rating is smoothed: while there are few reviews, it stays near the average of 4.4. One or two glowing reviews do not push it to the maximum; that takes hundreds of reviews without complaints.",
  },
  {
    q: "Чем уровень доверия отличается от оценки?",
    a: "Оценка отвечает на вопрос, довольны ли клиенты. Уровень доверия отвечает на вопрос, сколько за этой оценкой данных: объём отзывов, возраст обменника, присутствие на независимых мониторингах и результат нашей проверки.",
    en_q: "How is the trust level different from the rating?",
    en_a: "The rating answers whether customers are satisfied. The trust level answers how much data stands behind that rating: review volume, exchanger age, presence on independent monitorings and the result of our check.",
  },
  {
    q: "«Мало данных» значит, что обменник плохой?",
    a: "Нет. Этот статус получают новые обменники и те, о ком пока мало сведений. Негативный статус называется «Осторожно», и для него нужна конкретная причина, которую мы показываем на странице обменника.",
    en_q: "Does “Little data” mean the exchanger is bad?",
    en_a: "No. New exchangers and those we know little about get this status. The negative status is called “Caution”, and it requires a specific reason that we show on the exchanger's page.",
  },
  {
    q: "Можно ли купить оценку или уровень доверия?",
    a: "Нет. Оплата размещения, публикаций и партнёрские ссылки в расчёт не входят. Платная проверка даёт баллы только своим результатом, а отрицательный результат уровень снижает.",
    en_q: "Can the rating or trust level be bought?",
    en_a: "No. Payments for listing, posts and partner links are not part of the calculation. A paid check gives points only through its result, and a negative result lowers the level.",
  },
  {
    q: "Откуда берутся отзывы?",
    a: "С мониторингов BestChange, KursExpert, ChangeInfo, E-mon и Obmify, а также из отзывов пользователей P2PIE. Мы учитываем число положительных и отрицательных отзывов и открытые претензии. Тексты показываем со ссылкой на источник.",
    en_q: "Where do the reviews come from?",
    en_a: "From the BestChange, KursExpert, ChangeInfo, E-mon and Obmify monitorings, plus reviews from P2PIE users. We count positive and negative reviews and open claims. Texts are shown with a link to the source.",
  },
  {
    q: "Как часто пересчитывается рейтинг?",
    a: "Раз в час. Новые отзывы и претензии с мониторингов попадают в расчёт в течение суток.",
    en_q: "How often is the rating recalculated?",
    en_a: "Every hour. New reviews and claims from monitorings are included within a day.",
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

const Formula = ({ children }: { children: React.ReactNode }) => (
  <Box
    px="4"
    py="3"
    borderRadius="xl"
    bgColor="blackAlpha.300"
    color="bg.100"
    fontFamily="mono"
    fontSize="sm"
    overflowX="auto"
  >
    {children}
  </Box>
);

const RatingMethodPage = () => {
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
      title={t("Как считается рейтинг", "How the rating works")}
      subtitle={t(
        "Оценка клиентов и уровень доверия: что это и из чего складывается",
        "Customer rating and trust level: what they are and what goes into them",
      )}
      my="12"
    />

    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>{t("Два показателя вместо одного", "Two scores instead of one")}</H2>
          <P>
            {t(
              "Пять звёзд после одного обмена и четыре звезды после тысячи обменов говорят о разном. Поэтому у каждого обменника на P2PIE два показателя, и читать их стоит вместе.",
              "Five stars after one exchange and four stars after a thousand exchanges mean different things. That is why every exchanger on P2PIE has two scores, and they are best read together.",
            )}
          </P>
          <Flex gap="4" flexDir={{ base: "column", md: "row" }}>
            <Box flex="1" p="4" borderRadius="xl" bgColor="blackAlpha.300">
              <HStack mb="2">
                <Box color="yellow.400" filter="drop-shadow(0 0 6px rgba(236,201,75,0.6))">
                  <FaStar size="1.2rem" />
                </Box>
                <Text fontWeight="bold" color="bg.100">
                  {t("Оценка клиентов", "Customer rating")}
                </Text>
              </HStack>
              <P>
                {t(
                  "Число от 1 до 5 рядом со звездой. Показывает, что пишут люди, которые уже меняли деньги в этом обменнике.",
                  "A number from 1 to 5 next to the star. It shows what people who have already exchanged money with this exchanger say.",
                )}
              </P>
            </Box>
            <Box flex="1" p="4" borderRadius="xl" bgColor="blackAlpha.300">
              <HStack mb="2">
                <TrustBadge level="reliable" size="1.2rem" />
                <Text fontWeight="bold" color="bg.100">
                  {t("Уровень доверия", "Trust level")}
                </Text>
              </HStack>
              <P>
                {t(
                  "Значок щита и статус. Показывает, сколько данных стоит за оценкой: объём отзывов, возраст, независимые площадки и наша проверка.",
                  "A shield icon and a status. It shows how much data stands behind the rating: review volume, age, independent platforms and our check.",
                )}
              </P>
            </Box>
          </Flex>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>{t("Уровни доверия", "Trust levels")}</H2>
          <P>
            {t(
              "Баллы от 0 до 100 переводятся в один из четырёх статусов. Значок стоит рядом с названием обменника в списках, а на странице обменника показан разбор по каждому фактору.",
              "Points from 0 to 100 map to one of four statuses. The icon appears next to the exchanger name in lists, and the exchanger page shows a breakdown by each factor.",
            )}
          </P>
          {levels.map(({ level, when, en_when }) => (
            <Flex
              key={level}
              gap={{ base: 1, md: 4 }}
              flexDir={{ base: "column", md: "row" }}
              alignItems={{ base: "start", md: "center" }}
            >
              <Box w={{ md: "170px" }} flexShrink={0}>
                <TrustBadge level={level} withLabel size="1.1rem" />
              </Box>
              <Text color="bg.200">
                <b>{t(when, en_when)}.</b>{" "}
                {trustHint(TRUST_LEVELS[level], locale)}.
              </Text>
            </Flex>
          ))}
          <P>
            {t(
              "Статус «Осторожно» ставится в трёх случаях: наша проверка нашла серьёзные замечания, на мониторингах три и более открытых претензий или отрицательных отзывов больше 10 %. Причину мы пишем на странице обменника.",
              "The “Caution” status is set in three cases: our check found serious issues, there are three or more open claims on monitorings, or negative reviews exceed 10%. We state the reason on the exchanger page.",
            )}
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>{t("Из чего складываются баллы доверия", "What makes up the trust points")}</H2>
          {factors.map((f) => (
            <Flex key={f.name} gap={{ base: 0, md: 4 }} flexDir={{ base: "column", md: "row" }}>
              <HStack w={{ md: "230px" }} flexShrink={0} justifyContent="space-between" alignItems="start">
                <Text fontWeight="bold" color="bg.100">
                  {t(f.name, f.en_name)}
                </Text>
                <Text color="peach.300" whiteSpace="nowrap">
                  {t(f.max, f.en_max)}
                </Text>
              </HStack>
              <P>{t(f.text, f.en_text)}</P>
            </Flex>
          ))}
          <P>
            {t(
              "Сумма ограничена диапазоном от 0 до 100. Без нашей проверки обменник может набрать до 85 баллов, этого хватает для статуса «Надёжный».",
              "The total is limited to the range from 0 to 100. Without our check an exchanger can score up to 85 points, which is enough for the “Reliable” status.",
            )}
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>{t("Как считается оценка", "How the rating is calculated")}</H2>
          <P>
            {t(
              "Мы берём долю положительных отзывов и сглаживаем её: к настоящим отзывам добавляются 30 условных со средним результатом. Пока отзывов мало, оценка держится около 4,4, а с ростом их числа всё точнее отражает реальную картину.",
              "We take the share of positive reviews and smooth it: 30 virtual reviews with an average result are added to the real ones. While there are few reviews, the rating stays near 4.4, and as their number grows it reflects the real picture more and more accurately.",
            )}
          </P>
          <Formula>
            {t(
              "доля = (положительные + 25,5) / (положительные + 10 × отрицательные + 10 × открытые претензии + 30)",
              "share = (positive + 25.5) / (positive + 10 × negative + 10 × open claims + 30)",
            )}
            <br />
            {t("оценка = 1 + 4 × доля", "rating = 1 + 4 × share")}
          </Formula>
          <P>
            {t(
              "Отрицательный отзыв и открытая претензия весят в десять раз больше положительного отзыва. Мониторинги снимают жалобу после её урегулирования, поэтому те, что остались, значат много.",
              "A negative review and an open claim weigh ten times more than a positive review. Monitorings remove a complaint once it is settled, so the ones that remain mean a lot.",
            )}
          </P>
          <Flex gap="4" flexDir={{ base: "column", md: "row" }}>
            {examples.map((e) => (
              <Box key={e.title} flex="1" p="4" borderRadius="xl" bgColor="blackAlpha.300">
                <Text color="bg.300" fontSize="sm">
                  {t(e.title, e.en_title)}
                </Text>
                <HStack my="1">
                  <Box color="yellow.400">
                    <FaStar size="1rem" />
                  </Box>
                  <Text fontSize="xl" fontWeight="bold" color="bg.100">
                    {t(e.stars, e.en_stars)}
                  </Text>
                </HStack>
                <Text color="bg.200" fontSize="sm">
                  {t(e.note, e.en_note)}
                </Text>
              </Box>
            ))}
          </Flex>
          <P>
            {t(
              "Если отзывов нет совсем, оценку мы не считаем: показывать число, за которым ничего не стоит, было бы нечестно.",
              "If there are no reviews at all, we do not calculate a rating: showing a number with nothing behind it would be dishonest.",
            )}
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>{t("Откуда данные и что не влияет", "Data sources and what does not count")}</H2>
          <P>
            {t(
              "Отзывы и претензии мы собираем с BestChange, KursExpert, ChangeInfo, E-mon и Obmify и складываем с отзывами пользователей P2PIE. Возраст берём с тех же площадок и из карточки обменника. Расчёт обновляется раз в час.",
              "We collect reviews and claims from BestChange, KursExpert, ChangeInfo, E-mon and Obmify and add them to reviews from P2PIE users. Age comes from the same platforms and the exchanger's profile card. The calculation is updated every hour.",
            )}
          </P>
          <Box as="ul" pl="4" color="bg.200">
            <li>{t("Оплата размещения и публикаций на рейтинг не влияет.", "Payments for listing and posts do not affect the rating.")}</li>
            <li>{t("Партнёрские ссылки и комиссии на рейтинг не влияют.", "Partner links and commissions do not affect the rating.")}</li>
            <li>
              {t(
                "Платная проверка даёт баллы только своим результатом. Отрицательный результат уровень доверия снижает.",
                "A paid check gives points only through its result. A negative result lowers the trust level.",
              )}
            </li>
            <li>
              {t(
                "Порядок в таблице курсов зависит только от курса, а не от рейтинга.",
                "The order in the rates table depends only on the rate, not on the rating.",
              )}
            </li>
          </Box>
          <P>
            {t(
              "Вы представляете обменник и считаете расчёт неверным? Напишите на",
              "Do you represent an exchanger and think the calculation is wrong? Write to",
            )}{" "}
            <Link href={`mailto:${SUPPORT_EMAIL}`} color="blue.300">
              {SUPPORT_EMAIL}
            </Link>{" "}
            {t(
              "и приложите ссылки на свои профили в мониторингах. Условия размещения описаны на странице",
              "and attach links to your profiles on monitorings. Listing terms are described on the page",
            )}{" "}
            <Link as={NextLink} href="/for-exchangers" color="blue.300">
              {t("для обменников", "for exchangers")}
            </Link>
            .
          </P>
          <Text color="bg.300" fontSize="sm">
            {t("Методика:", "Method:")} {t(METHOD_VERSION, EN_METHOD_VERSION)}.
          </Text>
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

export default RatingMethodPage;
