import React from "react";
import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  HStack,
  Tag,
  VStack,
} from "@chakra-ui/react";
import { IoMdChatboxes, IoMdInformationCircle, IoMdListBox } from "react-icons/io";

import UniversalSeo from "../../shared/UniversalSeo";
import Loader from "../../shared/Loader";
import { BoxWrapper, CustomHeader, FormatedDate } from "../../shared/BoxWrapper";
import { ResponsiveText } from "../../../styles/theme/custom";
import { TextToHTML } from "../../shared/helper";
import { addSpaces } from "../../../redux/amountsHelper";
import { cmsLinkDEV, cmsLinkPROD } from "../../../services/utils";
import { ISEO } from "../../../types/general";

type MakerTag = {
  id?: string | number;
  name?: string | null;
  description?: string | null;
  color?: string | null;
};

type P2POffer = {
  id?: string | number;
  side?: string | null;
  isActive?: boolean | null;
  course?: number | null;
  min?: number | null;
  max?: number | null;
  fee_type?: string | null;
  fee_amount?: number | null;
};

type P2PReview = {
  id?: string | number;
  name?: string | null;
  text?: string | null;
  type?: string | null;
  isDispute?: boolean | null;
  updatedAt?: string | null;
};

type P2PMaker = {
  id: string | number;
  telegram_username?: string | null;
  telegram_name?: string | null;
  status?: string | null;
  createdAt?: string | null;
  description?: string | null;
  avatar?: {
    id?: string | number;
    url?: string | null;
    alternativeText?: string | null;
  } | null;
  exchanger_tags?: MakerTag[] | null;
  p_2_p_offers?: P2POffer[] | null;
  reviews?: P2PReview[] | null;
};

const getTelegramLink = (username?: string | null) => {
  const cleaned = (username || "").replace(/^@/, "").trim();
  return cleaned ? `https://t.me/${cleaned}` : "";
};

const getAvatarSrc = (url?: string | null) => {
  if (!url) return "";
  const env = process.env.NODE_ENV;
  const base = env === "production" ? cmsLinkPROD : cmsLinkDEV;
  return `${base}${url}`;
};

const StatItem = ({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) => {
  return (
    <HStack spacing="2">
      <ResponsiveText size="sm" color="bg.400" variant="primary">
        {label}
      </ResponsiveText>
      <ResponsiveText size="md" variant="primary" fontWeight="bold">
        {value ?? ""}
      </ResponsiveText>
    </HStack>
  );
};

export default function MakerPage({
  maker,
  seo,
}: {
  maker: P2PMaker | null;
  seo: ISEO;
}) {
  if (!maker) {
    return (
      <Center
        w="100%"
        h="100%"
        justifyContent="center"
        alignItems="center"
        minW="100"
        minH="100"
      >
        <Loader size="xl" />
      </Center>
    );
  }

  const displayName =
    maker.telegram_name || maker.telegram_username || "";
  const telegramLink = getTelegramLink(maker.telegram_username);
  const avatarSrc = getAvatarSrc(maker.avatar?.url);
  const tags = Array.isArray(maker.exchanger_tags) ? maker.exchanger_tags : [];
  const offers = Array.isArray(maker.p_2_p_offers) ? maker.p_2_p_offers : null;
  const reviews = Array.isArray(maker.reviews) ? maker.reviews : null;

  const offersCount = offers ? offers.length : null;
  const activeOffersCount = offers
    ? offers.filter((offer) => offer?.isActive).length
    : null;
  const reviewsCount = reviews ? reviews.length : null;

  return (
    <>
      <UniversalSeo seo={seo} />

      <BoxWrapper variant="no_contrast">
        <VStack alignItems="start" gap="4" w="100%">
          <HStack justifyContent="space-between" w="100%" gap="4">
            <HStack gap="4">
              <Avatar
                size="lg"
                name={displayName || undefined}
                src={avatarSrc || undefined}
              />
              <VStack alignItems="start" spacing="1">
                <ResponsiveText size="xl" variant="primary" fontWeight="bold">
                  {displayName}
                </ResponsiveText>
                <HStack spacing="3">
                  <ResponsiveText size="sm" color="bg.400" variant="primary">
                    {maker.telegram_username ? `@${maker.telegram_username.replace(/^@/, "")}` : ""}
                  </ResponsiveText>
                  {maker.status ? (
                    <Tag size="sm" colorScheme="orange">
                      {maker.status}
                    </Tag>
                  ) : null}
                </HStack>
              </VStack>
            </HStack>

            {telegramLink ? (
              <Button
                as="a"
                href={telegramLink}
                target="_blank"
                rel="noreferrer"
                size="sm"
                variant="outline"
              >
                Telegram
              </Button>
            ) : null}
          </HStack>

          {tags.length ? (
            <HStack spacing="2" flexWrap="wrap">
              {tags.map((tag) => (
                <Tag
                  key={tag.id || tag.name}
                  size="sm"
                  bg={tag.color || "bg.700"}
                  color="bg.100"
                >
                  {tag.name || ""}
                </Tag>
              ))}
            </HStack>
          ) : null}

          <Divider mb="2" />
          <Flex
            flexDir={{ base: "column", lg: "row" }}
            color="bg.200"
            justifyContent="space-between"
            w="100%"
            gap="4"
            px="2"
          >
            <StatItem label="Отзывы" value={reviewsCount} />
            <ResponsiveText display={{ base: "none", lg: "flex" }} variant="primary">
              •
            </ResponsiveText>
            <StatItem label="Предложений" value={offersCount} />
            <ResponsiveText display={{ base: "none", lg: "flex" }} variant="primary">
              •
            </ResponsiveText>
            <StatItem label="Активных" value={activeOffersCount} />
            <ResponsiveText display={{ base: "none", lg: "flex" }} variant="primary">
              •
            </ResponsiveText>
            <StatItem
              label="Создан"
              value={<FormatedDate updatedAt={maker.createdAt} />}
            />
          </Flex>
          <Divider my="2" display={{ lg: "none", base: "unset" }} />
        </VStack>
      </BoxWrapper>

      <BoxWrapper>
        <CustomHeader text="Описание" Icon={IoMdInformationCircle} />
        <Divider my="4" />
        <Box px="2" color="bg.400">
          <TextToHTML
            text={maker.description || ""}
            components={{
              p: ({ children }) => (
                <ResponsiveText size="sm" variant="primary" color="bg.300">
                  {children}
                </ResponsiveText>
              ),
            }}
          />
        </Box>
      </BoxWrapper>

      <BoxWrapper>
        <CustomHeader text="Предложения" Icon={IoMdListBox} />
        <Divider my="4" />
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap="4"
          px="2"
        >
          {offers?.map((offer) => (
            <Box key={offer.id} p="4" borderRadius="xl" bg="bg.900">
              <VStack alignItems="start" spacing="2">
                <HStack spacing="2">
                  <ResponsiveText size="sm" color="bg.400" variant="primary">
                    Сторона
                  </ResponsiveText>
                  <ResponsiveText size="md" variant="primary">
                    {offer.side || ""}
                  </ResponsiveText>
                </HStack>
                <HStack spacing="2">
                  <ResponsiveText size="sm" color="bg.400" variant="primary">
                    Курс
                  </ResponsiveText>
                  <ResponsiveText size="md" variant="primary">
                    {offer.course ?? ""}
                  </ResponsiveText>
                </HStack>
                <HStack spacing="2">
                  <ResponsiveText size="sm" color="bg.400" variant="primary">
                    Лимиты
                  </ResponsiveText>
                  <ResponsiveText size="md" variant="primary">
                    {offer.min != null || offer.max != null
                      ? `${addSpaces(String(offer.min ?? ""))} - ${addSpaces(
                          String(offer.max ?? "")
                        )}`
                      : ""}
                  </ResponsiveText>
                </HStack>
                <HStack spacing="2">
                  <ResponsiveText size="sm" color="bg.400" variant="primary">
                    Комиссия
                  </ResponsiveText>
                  <ResponsiveText size="md" variant="primary">
                    {offer.fee_amount != null
                      ? `${offer.fee_amount} ${offer.fee_type || ""}`
                      : ""}
                  </ResponsiveText>
                </HStack>
                <HStack spacing="2">
                  <ResponsiveText size="sm" color="bg.400" variant="primary">
                    Статус
                  </ResponsiveText>
                  <ResponsiveText size="md" variant="primary">
                    {offer.isActive != null ? (offer.isActive ? "active" : "inactive") : ""}
                  </ResponsiveText>
                </HStack>
              </VStack>
            </Box>
          )) || null}
        </Grid>
      </BoxWrapper>

      <BoxWrapper>
        <CustomHeader text="Отзывы" Icon={IoMdChatboxes} />
        <Divider my="4" />
        <VStack alignItems="start" spacing="4" px="2">
          {reviews?.map((review) => (
            <Box key={review.id} p="4" borderRadius="xl" bg="bg.900" w="100%">
              <HStack justifyContent="space-between" w="100%">
                <ResponsiveText size="sm" variant="primary" color="bg.400">
                  {review.name || ""}
                </ResponsiveText>
                <FormatedDate updatedAt={review.updatedAt} />
              </HStack>
              <ResponsiveText size="sm" variant="primary" color="bg.300">
                {review.text || ""}
              </ResponsiveText>
              <HStack spacing="2" mt="2">
                <ResponsiveText size="xs" variant="primary" color="bg.500">
                  {review.type || ""}
                </ResponsiveText>
                <ResponsiveText size="xs" variant="primary" color="bg.500">
                  {review.isDispute ? "dispute" : ""}
                </ResponsiveText>
              </HStack>
            </Box>
          )) || null}
        </VStack>
      </BoxWrapper>
    </>
  );
}
