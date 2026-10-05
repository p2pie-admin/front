import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  Link,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { BsTelegram } from "react-icons/bs";
import { RiShieldCheckLine, RiTimeLine, RiChatQuoteLine } from "react-icons/ri";
import WebsiteData from "./WebsiteData";
import FooterLinks from "./FooterLinks";

const SUPPORT_EMAIL = "support@p2pie.com";

// Short, factual trust line: how the data is produced. No numbers here (they change
// hourly and the footer is rendered on every page from the static layout).
const TRUST = [
  { icon: RiTimeLine, text: "Курсы из XML-выгрузок обменников, обновление каждые несколько минут" },
  { icon: RiChatQuoteLine, text: "Отзывы с указанием источника, без фильтра по тону" },
  { icon: RiShieldCheckLine, text: "Доступность обменников проверяется круглосуточно" },
];

const Footer = () => {
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_CHAT || "https://t.me/p2pie";
  return (
    <Box w="100%" px={{ base: "4", lg: "12%" }} as="footer">
      <Flex flexDir="column" justifyContent="space-between" alignItems="center">
        <Grid
          gridTemplateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr" }}
          w={{ base: "100%", lg: "70%" }}
          justifyContent="center"
          gridGap="4"
        >
          <FooterLinks links={aboutLinks} title={"О нас"} />
          <FooterLinks links={productLinks} title={"Сервисы"} />
          <FooterLinks links={supportLinks} title={"Поддержка"} />
        </Grid>

        <Divider mt="8" />

        <Wrap
          spacing={{ base: "3", md: "8" }}
          justify="center"
          mt="6"
          w={{ base: "100%", lg: "80%" }}
        >
          {TRUST.map((t) => (
            <WrapItem key={t.text} alignItems="center" maxW={{ base: "100%", md: "30%" }}>
              <HStack alignItems="start" spacing="2">
                <Icon as={t.icon} color="peach.300" boxSize="5" mt="0.5" flexShrink={0} />
                <Text fontSize="xs" color="bg.400" lineHeight="1.4">
                  {t.text}
                </Text>
              </HStack>
            </WrapItem>
          ))}
        </Wrap>

        <HStack mt="6" spacing="3" flexWrap="wrap" justifyContent="center">
          <Link
            href={`mailto:${SUPPORT_EMAIL}`}
            color="bg.300"
            fontSize="sm"
            _hover={{ color: "peach.200" }}
          >
            {SUPPORT_EMAIL}
          </Link>
          <Button
            as="a"
            href={telegram}
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
            variant="outline"
            borderColor="bg.500"
            color="bg.200"
            leftIcon={<BsTelegram size="1rem" />}
          >
            Telegram
          </Button>
        </HStack>

        <Text fontSize="xs" color="bg.500" mt="5" textAlign="center" maxW="640px" px="2">
          p2pie — мониторинг курсов. Мы не обменник, не проводим сделки и не храним средства
          пользователей: обмен происходит на сайте выбранного обменника.
        </Text>

        <WebsiteData />
      </Flex>
    </Box>
  );
};

export default Footer;

const aboutLinks = [
  { label: "О проекте", href: "/about" },
  { label: "Партнерство", href: "/partnership" },
  { label: "Для обменников", href: "/for-exchangers" },
  { label: "Блог", href: "/articles" },
];

const productLinks = [
  { label: "Курсы обмена", href: "/buy/usdttrc20-for-rub" },
  { label: "Карта обменников", href: "/map" },
  { label: "Список обменников", href: "/exchangers" },
  { label: "P2P мейкеры", href: "/p2p" },
];

const supportLinks = [
  { label: "FAQ", href: "/faq" },
  { label: "Контакты", href: "/contacts" },
  {
    label: "Телеграм группа",
    href: process.env.NEXT_PUBLIC_TELEGRAM_CHAT || "#",
  },
];
