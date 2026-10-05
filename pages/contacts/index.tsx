import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaTelegram, FaEnvelope } from "react-icons/fa";
import UniversalSeo from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";
import { TTL } from "../../cache/loadX";
import { Box3D } from "../../styles/theme/custom";

const SUPPORT_EMAIL = "support@p2pie.com";
const TELEGRAM = "https://t.me/p2pie";

const buildSeo = (): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  return {
    title: `Контакты ${brand} — связь с поддержкой`,
    description: `Свяжитесь с командой ${brand}: поддержка пользователей, вопросы о сотрудничестве, техническая помощь. Telegram и Email.`,
    canonicalSlug: "contacts",
    updatedAt: null,
  };
};

const TOPICS = [
  "Техническая поддержка и помощь пользователям",
  "Вопросы о курсах обмена и работе сервиса",
  "Размещение обменного пункта в каталоге",
  "Партнёрство и сотрудничество",
  "Реклама и маркетинг",
  "Сообщения об ошибках и предложения по улучшению",
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
}) => (
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
        Написать
      </Button>
    </HStack>
  </Box3D>
);

// Text colors come from the theme scale so both colour modes stay readable
// (the old page used gray.* and a light-blue card that turned white-on-white in dark mode).
const ContactsPage = () => {
  const seo = buildSeo();
  const body = useColorModeValue("bg.700", "bg.200");
  const muted = useColorModeValue("bg.600", "bg.300");

  return (
    <>
      <UniversalSeo seo={seo} />
      <Container maxW="container.md" py={{ base: 6, md: 10 }} px={{ base: 4, md: 6 }} color={body}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={2}>
              Контакты
            </Heading>
            <Text fontSize="lg" color={muted}>
              Свяжитесь с нами по любым вопросам
            </Text>
          </Box>

          <VStack spacing={3} align="stretch">
            <ContactCard
              icon={FaTelegram}
              title="Telegram"
              value="t.me/p2pie"
              note="Быстрая поддержка и новости проекта · ответ обычно в течение нескольких часов"
              href={TELEGRAM}
              color="telegram.500"
            />
            <ContactCard
              icon={FaEnvelope}
              title="Email"
              value={SUPPORT_EMAIL}
              note="Официальные запросы и партнёрство · ответ в течение 1–2 рабочих дней"
              href={`mailto:${SUPPORT_EMAIL}`}
              color="peach.300"
            />
          </VStack>

          <Box>
            <Heading as="h2" size="md" mb={3}>
              По каким вопросам можно обращаться
            </Heading>
            <VStack spacing={1} align="stretch" color={muted}>
              {TOPICS.map((t) => (
                <Text key={t}>• {t}</Text>
              ))}
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="md" mb={3}>
              О сервисе P2PIE
            </Heading>
            <Text mb={3} color={muted}>
              P2PIE — агрегатор обменных пунктов и P2P-площадка для обмена криптовалют,
              электронных и наличных денег. Мы помогаем находить лучшие курсы обмена и
              безопасно совершать сделки; сам обмен проходит на стороне выбранного обменника.
            </Text>
            <Text color={muted}>
              <strong>Регион работы:</strong> Россия и страны СНГ · <strong>Язык:</strong> русский
            </Text>
          </Box>

          <Text fontSize="sm" color="bg.400">
            Юридическая информация и реквизиты предоставляются по запросу.
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
