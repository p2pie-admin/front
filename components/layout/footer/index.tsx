import { Box, Grid, HStack, VStack } from "@chakra-ui/react";
import WebsiteData from "./WebsiteData";
import FooterLinks from "./FooterLinks";

const Footer = () => {
  return (
    <Box w="100%" px={{ base: "2", lg: "12%" }}>
      <HStack justifyContent="space-between" alignItems="start">
        <WebsiteData />
        <Grid
          gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
          w="70%"
          justifyContent="center"
        >
          <FooterLinks links={aboutLinks} title={"О нас"} />
          <FooterLinks links={productLinks} title={"Продукт"} />
          <FooterLinks links={supportLinks} title={"Поддержка"} />
          <FooterLinks links={otherLinks} title={"Другое"} />
          <FooterLinks links={communityLinks} title={"Сообщество"} />
        </Grid>
      </HStack>
    </Box>
  );
};

export default Footer;

const aboutLinks = [
  { label: "О проекте", href: "#" },
  { label: "Партнерство", href: "#" },
];

const productLinks = [
  { label: "Обмен", href: "#" },
  { label: "Продажа", href: "#" },
  { label: "Популярные", href: "#" },
];

const supportLinks = [
  { label: "FAQ", href: "#" },
  { label: "Контакты", href: "#" },
  { label: "Поддержка", href: process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || "#" },
];

const otherLinks = [
  { label: "Карта обменников", href: "/map" },
  { label: "Рейтинг обменников", href: "/exchangers" },
  { label: "Блог", href: "#" },
];

const communityLinks = [
  { label: "Telegram", href: process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || "#" },
  { label: "Facebook", href: "#" },
];
