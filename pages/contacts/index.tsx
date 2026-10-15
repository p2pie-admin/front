import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Link,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaTelegram, FaEnvelope } from "react-icons/fa";
import UniversalSeo from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";
import { TTL } from "../../cache/loadX";
import { Box3D } from "../../styles/theme/custom";
import { Locale, tr, useLocale, useT } from "../../services/i18n";

const SUPPORT_EMAIL = "support@p2pie.com";
const TELEGRAM = "https://t.me/p2pie";

const buildSeo = (locale: Locale = "ru"): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  return {
    title: tr(locale, `Контакты ${brand} — связь с поддержкой`, `${brand} contacts — reach support`),
    description: tr(
      locale,
      `Свяжитесь с командой ${brand}: поддержка пользователей, вопросы о сотрудничестве, техническая помощь. Telegram и Email.`,
      `Contact the ${brand} team: user support, partnership questions, technical help. Telegram and e-mail.`,
    ),
    canonicalSlug: "contacts",
    updatedAt: null,
  };
};

const TOPICS: [string, string][] = [
  ["Техническая поддержка и помощь пользователям", "Technical support and user help"],
  ["Вопросы о курсах обмена и работе сервиса", "Questions about exchange rates and how the service works"],
  ["Размещение обменного пункта в каталоге", "Listing an exchanger in the catalog"],
  ["Партнёрство и сотрудничество", "Partnership and cooperation"],
  ["Реклама и маркетинг", "Advertising and marketing"],
  ["Сообщения об ошибках и предложения по улучшению", "Bug reports and suggestions"],
];

const ContactCard = ({
  icon,
  title,
  value,
  note,
  href,
  color,
}: {
  icon: any;
  title: string;
  value: string;
  note: string;
  href: string;
  color: string;
}) => {
  const t = useT();
  return (
  <Box3D variant="extra_contrast" p="4">
    <HStack alignItems="center" spacing="4">
      <Icon as={icon} boxSize={7} color={color} flexShrink={0} />
      <Box flex="1" minW="0">
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        <Text fontSize="sm" wordBreak="break-all">
          {value}
        </Text>
        <Text fontSize="xs" color="bg.400" mt="1">
          {note}
        </Text>
      </Box>
      <Button
        as="a"
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        variant="primary"
        color="white"
        size="sm"
        flexShrink={0}
      >
        {t("Написать", "Write")}
      </Button>
    </HStack>
  </Box3D>
  );
};

// Text colors come from the theme scale so both colour modes stay readable
// (the old page used gray.* and a light-blue card that turned white-on-white in dark mode).
const ContactsPage = () => {
  const locale = useLocale();
  const t = useT();
  const seo = buildSeo(locale);
  const body = useColorModeValue("bg.700", "bg.200");
  const muted = useColorModeValue("bg.600", "bg.300");

  return (
    <>
      <UniversalSeo seo={seo} />
      <Container maxW="container.md" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }} color={body}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              {t("Контакты", "Contacts")}
            </Heading>
            <Text fontSize="lg" color={muted}>
              {t("Свяжитесь с нами по любым вопросам", "Get in touch with us about anything")}
            </Text>
          </Box>

          <VStack spacing={3} align="stretch">
            <ContactCard
              icon={FaTelegram}
              title="Telegram"
              value="t.me/p2pie"
              note={t("Быстрая поддержка и новости проекта · ответ обычно в течение нескольких часов", "Fast support and project news · we usually reply within a few hours")}
              href={TELEGRAM}
              color="telegram.500"
            />
            <ContactCard
              icon={FaEnvelope}
              title="Email"
              value={SUPPORT_EMAIL}
              note={t("Официальные запросы и партнёрство · ответ в течение 1–2 рабочих дней", "Official requests and partnership · reply within 1–2 business days")}
              href={`mailto:${SUPPORT_EMAIL}`}
              color="peach.300"
            />
          </VStack>

          <Box>
            <Heading as="h2" size="md" mb={3}>
              {t("По каким вопросам можно обращаться", "What you can contact us about")}
            </Heading>
            <VStack spacing={1} align="stretch" color={muted}>
              {TOPICS.map(([ru, en]) => (
                <Text key={ru}>• {t(ru, en)}</Text>
              ))}
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={3}>
              {t("Добавление обменника", "Adding an exchanger")}
            </Heading>
            <Text color={muted}>
              {t(
                "Бесплатно для обменников из BestChange, ExchangeSumo и KursExpert. Проверка новых обменников стоит 0.1 ETH, публикации на наших площадках 50 USDT, всё остальное бесплатно. Подробно на странице",
                "Free for exchangers listed on BestChange, ExchangeSumo and KursExpert. Review of new exchangers costs 0.1 ETH, posts on our channels 50 USDT, everything else is free. Details on the page",
              )}{" "}
              <Link as={NextLink} href="/for-exchangers" color="blue.300">
                {t("«Для обменников»", "“For exchangers”")}
              </Link>
              .
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={3}>
              {t("О сервисе P2PIE", "About P2PIE")}
            </Heading>
            <Text mb={3} color={muted}>
              {t(
                "P2PIE — агрегатор обменных пунктов и P2P-площадка для обмена криптовалют, электронных и наличных денег. Мы помогаем находить лучшие курсы обмена и безопасно совершать сделки; сам обмен проходит на стороне выбранного обменника.",
                "P2PIE is an exchanger aggregator and a P2P platform for exchanging crypto, e-money and cash. We help you find the best exchange rates and make deals safely; the exchange itself happens on the chosen exchanger's side.",
              )}
            </Text>
            <Text color={muted}>
              <strong>{t("Регион работы:", "Region:")}</strong> {t("Россия и страны СНГ", "Russia and CIS countries")} ·{" "}
              <strong>{t("Язык:", "Languages:")}</strong> {t("русский", "Russian, English")}
            </Text>
          </Box>

          <Text fontSize="sm" color="bg.400">
            {t(
              "Юридическая информация и реквизиты предоставляются по запросу.",
              "Legal information and company details are available on request.",
            )}
          </Text>
        </VStack>
      </Container>
    </>
  );
};

export const getStaticProps = async () => {
  return {
    props: {},
    revalidate: TTL.slowest,
  };
};

export default ContactsPage;
