import React, { useMemo } from "react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import {
  Box,
  Divider,
  HStack,
  Tag,
  useColorModeValue,
  VStack,
  Text,
  WrapItem,
} from "@chakra-ui/react";
import ExchangerReplies from "./ExchangerReplies";
import { IExchangerReview } from "../../../../types/exchanger";
import BoringAvatar from "boring-avatars";
import UserAgent from "./UserAgent";

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
    "rgba(143,92,292,0.0)",
    "rgba(177, 224, 247, 0.0)"
  );
  const positiveAmbientColor = useColorModeValue(
    "rgba(29, 179, 37, 0.18)",
    "rgba(29, 127, 75, 0.39)"
  );
  const negativeAmbientColor = useColorModeValue(
    "rgba(255, 0, 25, 0.32)",
    "rgba(157, 17, 17, 0.3)"
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
  const formattedDate = updatedAt
    ? new Intl.DateTimeFormat("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date(updatedAt))
    : "";

  const tag = useMemo(() => {
    if (isDispute === false) {
      return (
        <Tag size="sm" variant="outline" colorScheme="green">
          ДИСПУТ РЕШЕН ✓
        </Tag>
      );
    }

    if (isDispute === true) {
      return (
        <Tag size="sm" variant="outline" colorScheme="red">
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
      <Tag size="sm" variant="outline" colorScheme="blue">
        {label.toUpperCase()}
      </Tag>
    );
  }, [location]);

  return (
    <Box3D
      w="100%"
      p="4"
      my="6"
      variant="extra_contrast"
      position="relative"
      overflow="hidden"
    >
      <HStack justifyContent="space-between" spacing="4">
        <HStack gap="4">
          <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
            <BoringAvatar size={30} name={avatarSeed} variant="marble" />
          </Box>

          <ResponsiveText size="lg" fontWeight="bold" variant="contrast">
            {displayName}
          </ResponsiveText>
          {tag}
          {locationTag}
        </HStack>
        <HStack gap="4">
          {formattedDate && (
            <ResponsiveText color="bg.500">{formattedDate}</ResponsiveText>
          )}
          <UserAgent userAgent={userAgent} />
        </HStack>
      </HStack>

      <Divider my="4" />
      <Text whiteSpace="pre-wrap">{text}</Text>

      <Box mt="6">
        <ExchangerReplies />
      </Box>
      <Box
        position="absolute"
        top="0"
        w="100%"
        h="100%"
        zIndex={2000}
        pointerEvents="none" // <-- lets all clicks/touches pass through
        bgGradient={`radial-gradient(circle at 85% -10%, ${ambientColor} 0%, transparent 40%)`}
      />
      <Box
        position="absolute"
        bottom="0"
        left="0"
        w="100%"
        h="100%"
        zIndex={2000}
        pointerEvents="none" // <-- lets all clicks/touches pass through
        bgGradient={`radial-gradient(circle at 5% 70%, ${ambientColor} 0%, transparent 40%)`}
      />
    </Box3D>
  );
}
