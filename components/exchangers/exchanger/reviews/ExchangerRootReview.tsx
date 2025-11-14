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
} from "@chakra-ui/react";
import ExchangerReplies from "./ExchangerReplies";
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
import { HiReply } from "react-icons/hi";
import ReviewText from "../leaveReply";

export default function ExchangerRootReview({
  review,
}: {
  review: IExchangerReview;
}) {
  if (!review) return <></>;
  const {
    name,
    categories,
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
        <Tag size="sm" variant="outline" colorScheme="green" mt="1.5">
          ДИСПУТ РЕШЕН ✓
        </Tag>
      );
    }

    if (isDispute === true) {
      return (
        <Tag size="sm" variant="outline" colorScheme="red" mt="1.5">
          ДИСПУТ ОТКРЫТ ✕
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
    <BoxWrapper
      w="100%"
      p="4"
      my="6"
      variant="extra_contrast"
      position="relative"
      overflow="hidden"
    >
      <ReviewBorder>
        <HStack justifyContent="space-between" spacing="4">
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

            <ResponsiveText size="lg" fontWeight="bold" variant="contrast">
              {displayName}
            </ResponsiveText>
            {tag}
            {locationTag}
          </HStack>
          <HStack gap="4">
            <FormatedDate updatedAt={updatedAt} />

            <UserAgent userAgent={userAgent} />
          </HStack>
        </HStack>
        <Divider my="4" />
        <ReviewText text={text} />
      </ReviewBorder>

      {review_replies &&
        review_replies.map((reply) => (
          <ExchangerReplies
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
  );
}
