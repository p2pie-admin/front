import React, { useMemo } from "react";
import { Box3D, ResponsiveText } from "../../../../styles/theme/custom";
import {
  Box,
  Divider,
  HStack,
  Tag,
  Text,
  VStack,
  Wrap,
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
  } = review;

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

  return (
    <Box3D w="100%" p="4" my="6" variant="extra_contrast">
      <HStack justifyContent="space-between" spacing="4">
        <HStack gap="4">
          <Box borderRadius="full" overflow="hidden" w="30px" h="30px">
            <BoringAvatar size={30} name={avatarSeed} variant="marble" />
          </Box>

          <ResponsiveText size="lg" fontWeight="bold" variant="contrast">
            {displayName}
          </ResponsiveText>
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
    </Box3D>
  );
}
