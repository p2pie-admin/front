import Head from "next/head";
import NextLink from "next/link";
import { Box, Flex, Heading, HStack, Link, Text, VStack } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";

import { BoxWrapper } from "../../components/shared/BoxWrapper";
import CustomTitle from "../../components/shared/CustomTitle";
import UniversalSeo from "../../components/shared/UniversalSeo";
import TrustBadge from "../../components/shared/TrustBadge";
import { ITrustLevel, TRUST_LEVELS } from "../../components/shared/trust";
import { ISEO } from "../../types/general";

// Public description of the method implemented in competitors/src/core/rating.ts.
// Every number here mirrors a constant there: change both together and bump the version line.
const METHOD_VERSION = "версия 1 от 9 октября 2026";
const SUPPORT_EMAIL = "support@p2pie.com";

const seo: ISEO = {
  title: "Как считается рейтинг обменников на P2PIE",
  description:
    "Два показателя обменника на P2PIE: оценка клиентов по отзывам с мониторингов и уровень доверия по объёму отзывов, возрасту, присутствию на площадках и нашей проверке. Формулы, веса и примеры.",
  canonicalSlug: "rating",
};

const levels: { level: ITrustLevel; when: string }[] = [
  { level: "reliable", when: "70 баллов и больше" },
  { level: "verified", when: "от 45 до 69 баллов" },
  { level: "unknown", when: "меньше 45 баллов" },
  { level: "caution", when: "есть серьёзный негативный сигнал, сколько бы баллов ни набралось" },
];

const factors = [
  {
    name: "Отзывы",
    max: "до 30",
    text: "Сколько отзывов набралось на всех площадках. Шкала логарифмическая: 10 отзывов дают около 10 баллов, 100 дают 20, тысяча и больше дают все 30.",
  },
  {
    name: "Возраст",
    max: "до 25",
    text: "Сколько обменник работает по данным мониторингов и нашей карточки. Полный балл за 5 лет, до этого пропорционально.",
  },
  {
    name: "Мониторинги",
    max: "до 20",
    text: "Присутствие на независимых площадках: 10 баллов за BestChange и по 5 за каждую другую, но не больше 10.",
  },
  {
    name: "Проверка P2PIE",
    max: "до 15",
    text: "Наш собственный разбор: домен, история бренда, чёрные списки, жалобы на форумах. Положительный итог даёт 15 баллов, итог с оговорками 5, отрицательный снимает 25.",
  },
  {
    name: "Курсы сейчас",
    max: "10",
    text: "Обменник отдаёт курсы и наш парсер получает их прямо сейчас.",
  },
  {
    name: "Штрафы",
    max: "до −35",
    text: "Минус 5 за каждую открытую претензию на мониторинге (не больше 15). Минус 10, если отрицательных отзывов больше 2 %, и минус 20, если больше 10 %.",
  },
];

const examples = [
  { title: "1 положительный отзыв", stars: "4,42", note: "Почти как у новичка без отзывов: один отзыв ничего не доказывает." },
  { title: "400 положительных и 1 отрицательный", stars: "4,87", note: "Большой объём перевешивает единичную жалобу." },
  { title: "20 положительных и 4 отрицательных", stars: "3,02", note: "Каждая шестая сделка закончилась жалобой, и оценка это показывает." },
];

const faq = [
  {
    q: "Почему у обменника с идеальными отзывами не 5 звёзд?",
    a: "Оценка сглаживается: пока отзывов мало, она держится около среднего уровня 4,4. Один или два хвалебных отзыва не поднимают её до максимума, для этого нужны сотни отзывов без жалоб.",
  },
  {
    q: "Чем уровень доверия отличается от оценки?",
    a: "Оценка отвечает на вопрос, довольны ли клиенты. Уровень доверия отвечает на вопрос, сколько за этой оценкой данных: объём отзывов, возраст обменника, присутствие на независимых мониторингах и результат нашей проверки.",
  },
  {
    q: "«Мало данных» значит, что обменник плохой?",
    a: "Нет. Этот статус получают новые обменники и те, о ком пока мало сведений. Негативный статус называется «Осторожно», и для него нужна конкретная причина, которую мы показываем на странице обменника.",
  },
  {
    q: "Можно ли купить оценку или уровень доверия?",
    a: "Нет. Оплата размещения, публикаций и партнёрские ссылки в расчёт не входят. Платная проверка даёт баллы только своим результатом, а отрицательный результат уровень снижает.",
  },
  {
    q: "Откуда берутся отзывы?",
    a: "С мониторингов BestChange, KursExpert, ChangeInfo, E-mon и Obmify, а также из отзывов пользователей P2PIE. Мы учитываем число положительных и отрицательных отзывов и открытые претензии. Тексты показываем со ссылкой на источник.",
  },
  {
    q: "Как часто пересчитывается рейтинг?",
    a: "Раз в час. Новые отзывы и претензии с мониторингов попадают в расчёт в течение суток.",
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

const RatingMethodPage = () => (
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
      title="Как считается рейтинг"
      subtitle="Оценка клиентов и уровень доверия: что это и из чего складывается"
      my="12"
    />

    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>Два показателя вместо одного</H2>
          <P>
            Пять звёзд после одного обмена и четыре звезды после тысячи обменов
            говорят о разном. Поэтому у каждого обменника на P2PIE два
            показателя, и читать их стоит вместе.
          </P>
          <Flex gap="4" flexDir={{ base: "column", md: "row" }}>
            <Box flex="1" p="4" borderRadius="xl" bgColor="blackAlpha.300">
              <HStack mb="2">
                <Box color="yellow.400" filter="drop-shadow(0 0 6px rgba(236,201,75,0.6))">
                  <FaStar size="1.2rem" />
                </Box>
                <Text fontWeight="bold" color="bg.100">
                  Оценка клиентов
                </Text>
              </HStack>
              <P>
                Число от 1 до 5 рядом со звездой. Показывает, что пишут люди,
                которые уже меняли деньги в этом обменнике.
              </P>
            </Box>
            <Box flex="1" p="4" borderRadius="xl" bgColor="blackAlpha.300">
              <HStack mb="2">
                <TrustBadge level="reliable" size="1.2rem" />
                <Text fontWeight="bold" color="bg.100">
                  Уровень доверия
                </Text>
              </HStack>
              <P>
                Значок щита и статус. Показывает, сколько данных стоит за
                оценкой: объём отзывов, возраст, независимые площадки и наша
                проверка.
              </P>
            </Box>
          </Flex>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>Уровни доверия</H2>
          <P>
            Баллы от 0 до 100 переводятся в один из четырёх статусов. Значок
            стоит рядом с названием обменника в списках, а на странице
            обменника показан разбор по каждому фактору.
          </P>
          {levels.map(({ level, when }) => (
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
                <b>{when}.</b> {TRUST_LEVELS[level].hint}.
              </Text>
            </Flex>
          ))}
          <P>
            Статус «Осторожно» ставится в трёх случаях: наша проверка нашла
            серьёзные замечания, на мониторингах три и более открытых претензий
            или отрицательных отзывов больше 10 %. Причину мы пишем на странице
            обменника.
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>Из чего складываются баллы доверия</H2>
          {factors.map((f) => (
            <Flex key={f.name} gap={{ base: 0, md: 4 }} flexDir={{ base: "column", md: "row" }}>
              <HStack w={{ md: "230px" }} flexShrink={0} justifyContent="space-between" alignItems="start">
                <Text fontWeight="bold" color="bg.100">
                  {f.name}
                </Text>
                <Text color="peach.300" whiteSpace="nowrap">
                  {f.max}
                </Text>
              </HStack>
              <P>{f.text}</P>
            </Flex>
          ))}
          <P>
            Сумма ограничена диапазоном от 0 до 100. Без нашей проверки
            обменник может набрать до 85 баллов, этого хватает для статуса
            «Надёжный».
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>Как считается оценка</H2>
          <P>
            Мы берём долю положительных отзывов и сглаживаем её: к настоящим
            отзывам добавляются 30 условных со средним результатом. Пока
            отзывов мало, оценка держится около 4,4, а с ростом их числа всё
            точнее отражает реальную картину.
          </P>
          <Formula>
            доля = (положительные + 25,5) / (положительные + 10 × отрицательные
            + 10 × открытые претензии + 30)
            <br />
            оценка = 1 + 4 × доля
          </Formula>
          <P>
            Отрицательный отзыв и открытая претензия весят в десять раз больше
            положительного отзыва. Мониторинги снимают жалобу после её
            урегулирования, поэтому те, что остались, значат много.
          </P>
          <Flex gap="4" flexDir={{ base: "column", md: "row" }}>
            {examples.map((e) => (
              <Box key={e.title} flex="1" p="4" borderRadius="xl" bgColor="blackAlpha.300">
                <Text color="bg.300" fontSize="sm">
                  {e.title}
                </Text>
                <HStack my="1">
                  <Box color="yellow.400">
                    <FaStar size="1rem" />
                  </Box>
                  <Text fontSize="xl" fontWeight="bold" color="bg.100">
                    {e.stars}
                  </Text>
                </HStack>
                <Text color="bg.200" fontSize="sm">
                  {e.note}
                </Text>
              </Box>
            ))}
          </Flex>
          <P>
            Если отзывов нет совсем, оценку мы не считаем: показывать число, за
            которым ничего не стоит, было бы нечестно.
          </P>
        </VStack>
      </BoxWrapper>

      <BoxWrapper p={{ base: 4, md: 6 }} variant="extra_contrast">
        <VStack align="stretch" spacing="3">
          <H2>Откуда данные и что не влияет</H2>
          <P>
            Отзывы и претензии мы собираем с BestChange, KursExpert,
            ChangeInfo, E-mon и Obmify и складываем с отзывами пользователей
            P2PIE. Возраст берём с тех же площадок и из карточки обменника.
            Расчёт обновляется раз в час.
          </P>
          <Box as="ul" pl="4" color="bg.200">
            <li>Оплата размещения и публикаций на рейтинг не влияет.</li>
            <li>Партнёрские ссылки и комиссии на рейтинг не влияют.</li>
            <li>
              Платная проверка даёт баллы только своим результатом. Отрицательный
              результат уровень доверия снижает.
            </li>
            <li>
              Порядок в таблице курсов зависит только от курса, а не от рейтинга.
            </li>
          </Box>
          <P>
            Вы представляете обменник и считаете расчёт неверным? Напишите на{" "}
            <Link href={`mailto:${SUPPORT_EMAIL}`} color="blue.300">
              {SUPPORT_EMAIL}
            </Link>{" "}
            и приложите ссылки на свои профили в мониторингах. Условия
            размещения описаны на странице{" "}
            <Link as={NextLink} href="/for-exchangers" color="blue.300">
              для обменников
            </Link>
            .
          </P>
          <Text color="bg.300" fontSize="sm">
            Методика: {METHOD_VERSION}.
          </Text>
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

export default RatingMethodPage;
