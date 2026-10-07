import { Box, Flex, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import Link from "next/link";
import BoringAvatar from "boring-avatars";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { IExchangerReview } from "../../../types/exchanger";
import { exchangerNameToSlug } from "../../exchangers/helper";
import CustomImage from "../../shared/CustomImage";
import RelativeTime from "../../shared/RelativeTime";

const TEXT_MAX = 180;

// Platform badge: our own users' reviews vs. copies from other monitorings (labelled with the source).
const SourceBadge = ({ source }: { source?: string | null }) => {
  const own = !source;
  return (
    <Box
      as="span"
      px="2"
      py="0.5"
      borderRadius="full"
      fontSize="2xs"
      fontWeight="semibold"
      letterSpacing="0.03em"
      textTransform="uppercase"
      whiteSpace="nowrap"
      border="1px solid"
      color={own ? "peach.300" : "purple.300"}
      borderColor={own ? "peach.300" : "purple.300"}
      opacity={0.9}
    >
      {own ? "p2pie" : source}
    </Box>
  );
};

const HomeReviewCard = ({ review }: { review: IExchangerReview }) => {
  const bg = useColorModeValue("white", "bg.900");
  const border = useColorModeValue("blackAlpha.100", "whiteAlpha.100");
  const ink = useColorModeValue("gray.800", "gray.100");
  const ex = review.exchanger;
  const slug = ex?.name ? exchangerNameToSlug(ex.name) : null;
  const text = (review.text || "").trim();
  const short = text.length > TEXT_MAX ? `${text.slice(0, TEXT_MAX).trimEnd()}…` : text;
  const tone = review.type;

  const body = (
    <Flex
      direction="column"
      h="100%"
      p="4"
      gap="3"
      bg={bg}
      color={ink}
      borderRadius="2xl"
      border="1px solid"
      borderColor={border}
      transition="border-color .15s, transform .15s"
      _hover={{ borderColor: "peach.300", transform: "translateY(-2px)" }}
    >
      <HStack spacing="3" align="center">
        <Box borderRadius="lg" overflow="hidden" flexShrink={0} w="32px" h="32px">
          <CustomImage img={ex?.logo} w="32px" h="32px" />
        </Box>
        <Box minW="0" flex="1">
          <Text fontWeight="bold" fontSize="sm" noOfLines={1}>
            {ex?.display_name || ex?.name || "Обменник"}
          </Text>
          <Text fontSize="xs" color="bg.500" noOfLines={1}>
            <RelativeTime date={review.review_date || review.updatedAt} />
          </Text>
        </Box>
        <SourceBadge source={review.source} />
      </HStack>

      <Text
        fontSize="sm"
        flex="1"
        noOfLines={4}
        // Copied texts from other monitorings stay out of search snippets (same rule as exchanger pages).
        {...(review.source ? { "data-nosnippet": "" } : {})}
      >
        {short}
      </Text>

      <HStack spacing="2" color="bg.500" fontSize="xs">
        <Box borderRadius="full" overflow="hidden" w="18px" h="18px" flexShrink={0}>
          <BoringAvatar size={18} name={review.fingerprint || review.name || review.id} variant="marble" />
        </Box>
        <Text noOfLines={1} flex="1">
          {review.name?.trim() || "Аноним"}
        </Text>
        <Icon
          as={
            tone === "positive"
              ? MdSentimentSatisfiedAlt
              : tone === "negative"
                ? MdSentimentVeryDissatisfied
                : MdOutlineSentimentNeutral
          }
          w="4"
          h="4"
          color={tone === "positive" ? "green.300" : tone === "negative" ? "red.300" : "gray.400"}
          aria-label={tone === "positive" ? "положительный" : tone === "negative" ? "отрицательный" : "нейтральный"}
        />
      </HStack>
    </Flex>
  );

  return slug ? (
    <Link href={`/exchangers/${slug}`} prefetch={false} style={{ display: "block", height: "100%" }}>
      {body}
    </Link>
  ) : (
    body
  );
};

export default HomeReviewCard;
