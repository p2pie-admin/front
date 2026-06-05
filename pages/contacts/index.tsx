import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Link,
  Icon,
} from "@chakra-ui/react";
import { FaTelegram, FaEnvelope } from "react-icons/fa";
import UniversalSeo from "../../components/shared/UniversalSeo";
import { ISEO } from "../../types/general";
import { TTL } from "../../cache/loadX";

const buildSeo = (): ISEO => {
  const brand = process.env.NEXT_PUBLIC_NAME || "p2pie";

  return {
    title: `Контакты ${brand} — связь с поддержкой`,
    description: `Свяжитесь с командой ${brand}: поддержка пользователей, вопросы о сотрудничестве, техническая помощь. Telegram и Email.`,
    canonicalSlug: "contacts",
    updatedAt: null,
  };
};

const ContactsPage = () => {
  const seo = buildSeo();

  return (
    <>
      <UniversalSeo seo={seo} />
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          <Box>
            <Heading as="h1" size="xl" mb={4}>
              Контакты
            </Heading>
            <Text fontSize="lg" color="gray.600">
              Свяжитесь с нами по любым вопросам
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4}>
              О сервисе P2PIE
            </Heading>
            <Text mb={4}>
              P2PIE — это агрегатор обменных пунктов и P2P-площадка для обмена
              криптовалют, электронных и наличных денег. Мы помогаем
              пользователям находить лучшие курсы обмена и безопасно совершать
              сделки.
            </Text>
            <Text mb={4}>
              <strong>Регион работы:</strong> Россия и страны СНГ
            </Text>
            <Text>
              <strong>Язык интерфейса:</strong> Русский
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4}>
              Способы связи
            </Heading>

            <VStack spacing={4} align="stretch">
              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                _hover={{ bg: "gray.50" }}
                transition="all 0.2s"
              >
                <Link
                  href="https://t.me/p2pie"
                  isExternal
                  display="flex"
                  alignItems="center"
                  _hover={{ textDecoration: "none" }}
                >
                  <Icon
                    as={FaTelegram}
                    boxSize={6}
                    color="telegram.500"
                    mr={3}
                  />
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      Telegram
                    </Text>
                    <Text color="gray.600">t.me/p2pie</Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Быстрая поддержка и новости проекта
                    </Text>
                  </Box>
                </Link>
              </Box>

              <Box
                p={4}
                borderWidth={1}
                borderRadius="lg"
                _hover={{ bg: "gray.50" }}
                transition="all 0.2s"
              >
                <Link
                  href="mailto:support@p2pie.com"
                  display="flex"
                  alignItems="center"
                  _hover={{ textDecoration: "none" }}
                >
                  <Icon as={FaEnvelope} boxSize={6} color="blue.500" mr={3} />
                  <Box>
                    <Text fontWeight="bold" fontSize="lg">
                      Email
                    </Text>
                    <Text color="gray.600">support@p2pie.com</Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Для официальных запросов и партнёрства
                    </Text>
                  </Box>
                </Link>
              </Box>
            </VStack>
          </Box>

          <Box>
            <Heading as="h2" size="lg" mb={4}>
              По каким вопросам можно обращаться
            </Heading>
            <VStack spacing={2} align="stretch">
              <Text>• Техническая поддержка и помощь пользователям</Text>
              <Text>• Вопросы о курсах обмена и работе сервиса</Text>
              <Text>• Размещение обменного пункта в каталоге</Text>
              <Text>• Партнёрство и сотрудничество</Text>
              <Text>• Реклама и маркетинг</Text>
              <Text>• Сообщения об ошибках и предложения по улучшению</Text>
            </VStack>
          </Box>

          <Box bg="blue.50" p={6} borderRadius="lg">
            <Heading as="h3" size="md" mb={3}>
              Время ответа
            </Heading>
            <Text>
              <strong>Telegram:</strong> обычно в течение нескольких часов
            </Text>
            <Text>
              <strong>Email:</strong> в течение 1-2 рабочих дней
            </Text>
          </Box>

          <Box>
            <Text fontSize="sm" color="gray.500">
              Юридическая информация и реквизиты предоставляются по запросу.
            </Text>
          </Box>
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
