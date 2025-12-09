import React, { useMemo } from "react";
import { ResponsiveText } from "../../../../styles/theme/custom";
import {
  Box,
  Divider,
  HStack,
  Tag,
  useColorModeValue,
  VStack,
  Text,
  Icon,
  Grid,
  Button,
  Flex,
  Wrap,
  Center,
  Highlight,
} from "@chakra-ui/react";
import ExchangerReply from "./ExchangerReply";
import { IExchangerReview } from "../../../../types/exchanger";
import BoringAvatar from "boring-avatars";
import UserAgent from "./UserAgent";

import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import {
  BoxWrapper,
  ReviewBorder,
  FormatedDate,
} from "../../../shared/BoxWrapper";
import { useAppSelector } from "../../../../redux/hooks";
import { maskIP } from "../../../../pages/exchangers/[slug]";
import { LinkWrapper } from "../../../exchange/pmLayout/LinkWrapper";
import CustomImage from "../../../shared/CustomImage";

export default function ExchangerRootReview({
  review,
  slug,
}: {
  review: IExchangerReview;
  slug?: string;
}) {
  const userIP = useAppSelector((state) => maskIP(state.main.fingerprint?.ip));
  const textIsLink = /^(https?:\/\/|www\.)[^\s]+$/i.test(review?.text || "");

  if (!review) return <></>;
  const {
    name,
    location,
    text,
    type,
    userAgent,
    review_replies,
    updatedAt,
    isDispute,
  } = review;

  const defaultAmbientColor = useColorModeValue(
    "rgba(143,92,292,0.2)",
    "rgba(128, 125, 121, 0.25)"
  );
  const positiveAmbientColor = useColorModeValue(
    "rgba(29, 179, 37, 0.18)",
    "rgba(15, 66, 39, 0.39)"
  );
  const negativeAmbientColor = useColorModeValue(
    "rgba(255, 0, 25, 0.32)",
    "rgba(114, 13, 13, 0.3)"
  );
  const ambientColor = useMemo(() => {
    if (type === "positive") return positiveAmbientColor;
    if (type === "negative") return negativeAmbientColor;
    return defaultAmbientColor;
  }, [type, defaultAmbientColor, positiveAmbientColor, negativeAmbientColor]);

  const avatarSeed = useMemo(
    () =>
      review.fingerprint ||
      name ||
      review.id ||
      Math.random().toString(36).slice(2),
    [review.fingerprint, name, review.id]
  );

  const displayName = name?.trim() || "Аноним";

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
          РЕШЕН ✓
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
          ДИСПУТ ✕
        </Tag>
      );
    }

    return null;
  }, [isDispute]);

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

  return (
    <LinkWrapper
      _blank={textIsLink}
      exists={!!slug || textIsLink}
      url={textIsLink ? review?.text || "#" : "/" + slug}
    >
      <BoxWrapper
        w="100%"
        p="4"
        my="6"
        variant={slug ? "contrast" : "extra_contrast"}
        position="relative"
        overflow="hidden"
        minH={textIsLink || slug ? "220px" : "unset"}
        display="flex"
        h="100%"
      >
        <ReviewBorder display="flex" flexDirection="column" h="100%" gap="4">
          <Flex
            flexDir={{ base: "column", lg: slug ? "column" : "row" }}
            justifyContent="space-between"
            gap="4"
            w="100%"
          >
            <HStack gap="4" alignItems="flex-start">
              <Box position="relative" w="30px" h="30px">
                <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
                  <BoringAvatar size={30} name={avatarSeed} variant="marble" />
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
                {displayName}
              </ResponsiveText>

              <Box
                justifySelf="end"
                ml="auto"
                display={{ base: "flex", lg: slug ? "flex" : "none" }}
                alignSelf="center"
              >
                <UserAgent userAgent={userAgent} />
              </Box>
              <Wrap display={{ base: "none", lg: "flex" }}>
                {tag}
                {locationTag}
              </Wrap>
            </HStack>
            <Wrap display={{ base: "flex", lg: "none" }}>
              {tag}
              {locationTag}
            </Wrap>
            <HStack gap="4" color="bg.500">
              {review.ipAddress && (
                <ResponsiveText size="xs">{`IP: ${review.ipAddress}`}</ResponsiveText>
              )}
              <FormatedDate updatedAt={updatedAt} />
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
            {review.screenshots && textIsLink && (
              <CustomImage
                h="90px"
                w="auto"
                img={review.screenshots[0]}
                objectFit="contain"
              />
            )}
            {!textIsLink && !!text && (
              <Highlight
                query={["читать далее"]}
                styles={{ color: "peach.300", textDecoration: "underline" }}
              >
                {slug && text.length > 62
                  ? `${text.slice(0, 62)}... читать далее`
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
              displayName={displayName}
              avatarSeed={avatarSeed}
              exchangerName={review?.exchanger?.name}
              exchangerLogo={review?.exchanger?.logo}
            />
          ))}

        <Box
          position="absolute"
          top="0"
          w="100%"
          h="100%"
          zIndex={0}
          pointerEvents="none" // <-- lets all clicks/touches pass through
          bgGradient={`radial-gradient(circle at 85% -10%, ${ambientColor} 0%, transparent 40%)`}
        />
        <Box
          position="absolute"
          bottom="0"
          left="0"
          w="100%"
          h="100%"
          zIndex={0}
          pointerEvents="none" // <-- lets all clicks/touches pass through
          bgGradient={`radial-gradient(circle at 5% 70%, ${ambientColor} 0%, transparent 40%)`}
        />
      </BoxWrapper>
    </LinkWrapper>
  );
}
