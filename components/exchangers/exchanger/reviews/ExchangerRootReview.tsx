import React, { useMemo } from "react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import {
  Box,
  Divider,
  HStack,
  Tag,
  Flex,
  Wrap,
  Highlight,
  Icon,
} from "@chakra-ui/react";
import ExchangerReply from "./ExchangerReply";
import { IExchangerReview } from "../../../../types/exchanger";
import BoringAvatar from "boring-avatars";
import UserAgent from "./UserAgent";
import OutLink from "../../../shared/OutLink";

import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { ReviewBorder, FormatedDate } from "../../../shared/BoxWrapper";
import { useAppSelector } from "../../../../redux/hooks";
import { maskIP } from "../../../../services/maskIP";
import CustomImage from "../../../shared/CustomImage";
import {
  ReviewCardWrapper,
  useReviewCardMeta,
} from "../../../shared/ReviewCardWrapper";
import { useLocale, useT } from "../../../../services/i18n";

export default function ExchangerRootReview({
  review,
  slug,
}: {
  review: IExchangerReview;
  slug?: string;
}) {
  const locale = useLocale();
  const t = useT();
  const meta = useReviewCardMeta(review);
  const userIP = useAppSelector((state) => maskIP(state.main.fingerprint?.ip));
  const shouldEqualizeHeight = Boolean(slug);

  if (!review) return <></>;
  const {
    location,
    text,
    type,
    userAgent,
    review_replies,
    updatedAt,
    isDispute,
    source,
    external_link,
    external_date,
    review_date,
  } = review;

  const tag = useMemo(() => {
    if (isDispute === false) {
      return (
        <Tag
          size="sm"
          px="1"
          py="0.5"
          variant="outline"
          colorScheme="green"
          mt="1.5"
        >
          {t("РЕШЕН ✓", "RESOLVED ✓")}
        </Tag>
      );
    }

    if (isDispute === true) {
      return (
        <Tag
          size="sm"
          variant="outline"
          px="1"
          py="0.5"
          colorScheme="red"
          mt="1.5"
        >
          {t("ДИСПУТ ✕", "DISPUTE ✕")}
        </Tag>
      );
    }

    return null;
  }, [isDispute, locale]);

  const locationTag = useMemo(() => {
    if (!location) return null;

    const label = typeof location === "string" ? location.trim() : "";

    if (!label) return null;

    return (
      <Tag size="sm" variant="outline" colorScheme="blue" mt="1.5">
        {label.toUpperCase()}
      </Tag>
    );
  }, [location]);

  // Reviews copied from another monitoring carry their origin: a tag that opens the original on click.
  // Deliberately not an <a>: no outbound link in the HTML.
  const sourceTag = useMemo(() => {
    if (!source) return null;
    // A review left after a deal run by the p2pie bot: verified badge, plus the on-chain mark when a transfer was checked.
    if (source === "p2p_deal") {
      const chain = review.ai_data?.chain;
      return (
        <>
          <Tag size="sm" variant="solid" colorScheme="green" mt="1.5">
            {t("✓ СДЕЛКА ЧЕРЕЗ P2PIE", "✓ DEAL VIA P2PIE")}
          </Tag>
          {chain && (
            <Tag
              size="sm"
              variant="outline"
              colorScheme="green"
              mt="1.5"
              title={
                locale === "en"
                  ? `Transfer of ${chain.amount ?? ""} on ${chain.network ?? ""} verified on the blockchain by the p2pie bot. sha256 fingerprint: ${chain.proof ?? ""}. The customer can prove the deal with their secret code; addresses and the hash are not published.`
                  : `Перевод ${chain.amount ?? ""} в сети ${chain.network ?? ""} проверен ботом p2pie в блокчейне. Отпечаток sha256: ${chain.proof ?? ""}. Клиент может доказать сделку своим секретным кодом, адреса и хеш не публикуются.`
              }
            >
              {t("⛓ ПОДТВЕРЖДЕНО В БЛОКЧЕЙНЕ", "⛓ VERIFIED ON BLOCKCHAIN")}
            </Tag>
          )}
        </>
      );
    }
    const tag = (
      <Tag size="sm" variant="outline" colorScheme="purple" mt="1.5" cursor={external_link ? "pointer" : undefined}>
        {`${t("ИСТОЧНИК", "SOURCE")}: ${source.toUpperCase()}${external_link ? " ↗" : ""}`}
      </Tag>
    );
    return external_link ? (
      <OutLink
        href={external_link}
        label={`${t("Оригинал отзыва на", "Original review on")} ${source}`}
        data-track="external-review-source"
        data-track-label={source}
      >
        {tag}
      </OutLink>
    ) : (
      tag
    );
  }, [source, external_link, review.ai_data, locale]);

  const cardMinHeight = meta.textIsLink || slug ? "200px" : "unset";

  return (
    <ReviewCardWrapper
      review={review}
      meta={meta}
      href={slug ? "/" + slug : undefined}
      minHeight={cardMinHeight}
      variant={slug ? "contrast" : "extra_contrast"}
    >
      <ReviewBorder
        h={shouldEqualizeHeight ? "100%" : undefined}
        display={shouldEqualizeHeight ? "flex" : undefined}
        flexDirection={shouldEqualizeHeight ? "column" : undefined}
        flex={shouldEqualizeHeight ? "1" : undefined}
      >
        <Flex
          flexDir={{ base: "column", lg: slug ? "column" : "row" }}
          justifyContent="space-between"
          gap="4"
        >
          <HStack gap="4" alignItems="flex-start">
            <Box position="relative" w="30px" h="30px">
              <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
                <BoringAvatar
                  size={30}
                  name={meta.avatarSeed}
                  variant="marble"
                />
              </Box>
              <Box
                position="absolute"
                bottom="-5px"
                right="-5px"
                bgColor="bg.800"
                borderRadius="full"
                w="20px"
                h="20px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon
                  as={
                    type === "positive"
                      ? MdSentimentSatisfiedAlt
                      : type === "negative"
                        ? MdSentimentVeryDissatisfied
                        : MdOutlineSentimentNeutral
                  }
                  w="4"
                  h="4"
                  color={
                    type === "positive"
                      ? "green.300"
                      : type === "negative"
                        ? "red.300"
                        : "gray.300"
                  }
                />
              </Box>
            </Box>

            <ResponsiveText
              size="lg"
              fontWeight="bold"
              variant="contrast"
              mt={{ base: "1", lg: "0" }}
            >
              {meta.displayName}
              {review.ai_data?.stars ? (
                <Box as="span" ml="2" color="yellow.300" fontSize="sm" aria-label={`${review.ai_data.stars} ${t("из", "of")} 5`}>
                  {"★".repeat(review.ai_data.stars)}
                  <Box as="span" color="bg.500">{"★".repeat(5 - review.ai_data.stars)}</Box>
                </Box>
              ) : null}
            </ResponsiveText>

            <Box
              justifySelf="end"
              ml="auto"
              display={{ base: "flex", lg: slug ? "flex" : "none" }}
              alignSelf="center"
            >
              <UserAgent userAgent={userAgent} />
            </Box>
            {review.ipAddress && (
              <ResponsiveText
                size="xs"
                mt="1.5"
              >{`IP: ${maskIP(review.ipAddress)}`}</ResponsiveText>
            )}
            <HStack display={{ base: "none", lg: "flex" }}>
              {tag}
              {locationTag}
              {sourceTag}
            </HStack>
          </HStack>
          <Wrap display={{ base: "flex", lg: "none" }}>
            {tag}
            {locationTag}
            {sourceTag}
          </Wrap>
          <HStack gap="4" color="bg.500">
            <FormatedDate updatedAt={review_date ?? external_date ?? updatedAt} />
            <Box
              justifySelf="end"
              ml="auto"
              display={{ base: "none", lg: slug ? "none" : "flex" }}
            >
              <UserAgent userAgent={userAgent} />
            </Box>
          </HStack>
        </Flex>
        <Divider my="4" />
        <Box h="100%" flex="1">
          {review.screenshots && meta.textIsLink && (
            <CustomImage
              h="90px"
              w="auto"
              img={review.screenshots[0]}
              objectFit="contain"
            />
          )}
          {!meta.textIsLink && !!text && (
            <Highlight
              query={[t("читать далее", "read more")]}
              styles={{ color: "peach.300", textDecoration: "underline" }}
            >
              {slug && text.length > 62
                ? `${text.slice(0, 62)}... ${t("читать далее", "read more")}`
                : text}
            </Highlight>
          )}
        </Box>
      </ReviewBorder>

      {!slug &&
        review_replies &&
        review_replies.map((reply) => (
          <ExchangerReply
            key={reply.id}
            canReply={review.ipAddress == userIP && reply.from !== "author"}
            reply={reply}
            displayName={meta.displayName}
            avatarSeed={meta.avatarSeed}
            exchangerName={review?.exchanger?.name}
            exchangerLogo={review?.exchanger?.logo}
          />
        ))}
    </ReviewCardWrapper>
  );
}
