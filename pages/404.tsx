import React from "react";
import { Box, Button, Flex, Heading, Link, Text, Wrap, WrapItem } from "@chakra-ui/react";
import NextLink from "next/link";
import { BsTelegram } from "react-icons/bs";
import { Box3D } from "../styles/theme/custom";
import GlobalSearch from "../components/layout/nav/globalSearch";

const LINKS = [
  { label: "Главная", href: "/" },
  { label: "Курсы обмена", href: "/buy/usdttrc20-for-rub" },
  { label: "Обменники", href: "/exchangers" },
  { label: "Карта офисов", href: "/map" },
  { label: "Блог", href: "/articles" },
  { label: "FAQ", href: "/faq" },
];

// 404 with a way out: search (same index as the header search) and the main sections.
function NotFound() {
  const support = process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || "https://t.me/p2pie";
  return (
    <Flex width="100%" justifyContent="center" alignItems="center" mt="5" px="3">
      <Box3D w="100%" maxW="520px" p={{ base: 5, md: 8 }} variant="extra_contrast" textAlign="center">
        <Heading as="h1" fontSize={{ base: "5xl", md: "6xl" }} color="bg.400" lineHeight="1">
          404
        </Heading>
        <Text fontSize="lg" mt="2" mb="5">
          Такой страницы нет
        </Text>
        <Text fontSize="sm" color="bg.400" mb="2">
          Найти обменник или направление:
        </Text>
        <Box mb="5">
          <GlobalSearch alwaysOpen />
        </Box>
        <Wrap justify="center" spacing="2" mb="5">
          {LINKS.map((l) => (
            <WrapItem key={l.href}>
              <Button
                as={NextLink}
                href={l.href}
                prefetch={false}
                size="sm"
                variant="outline"
                borderColor="bg.500"
                color="bg.200"
              >
                {l.label}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
        <Link
          href={support}
          isExternal
          fontSize="sm"
          color="peach.300"
          display="inline-flex"
          alignItems="center"
          gap="2"
        >
          <BsTelegram /> Сообщить об ошибке
        </Link>
      </Box3D>
    </Flex>
  );
}

export default NotFound;
