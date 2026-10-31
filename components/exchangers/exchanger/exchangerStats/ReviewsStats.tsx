import { HStack, Icon } from "@chakra-ui/react";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IExchangerReview } from "../../../../types/exchanger";
import { useT } from "../../../../services/i18n";

type Counts = { positive: number; neutral: number; negative: number };

// The rating's totals across all monitorings win over our copied subset, which wins over counting the (capped) list.
// Otherwise the header said «44» while the rating block said «592 on 3 platforms».
const ReviewsStats = ({
  reviews,
  counts,
  aggregated,
}: {
  reviews?: IExchangerReview[] | null;
  counts?: Counts | null;
  aggregated?: { total: number; positive?: number; negative?: number } | null;
}) => {
  const t = useT();
  const agg = aggregated && aggregated.total > 0 && aggregated.positive != null ? aggregated : null;
  if (!agg && !counts && (!reviews || !reviews.length)) return <></>;
  const positive = agg ? agg.positive! : counts ? counts.positive : reviews!.filter((r) => r.type === "positive").length;
  const negative = agg ? agg.negative ?? 0 : counts ? counts.negative : reviews!.filter((r) => r.type === "negative").length;
  const neutral = agg
    ? Math.max(0, agg.total - positive - negative)
    : counts
      ? counts.neutral
      : reviews!.length - positive - negative;
  if (positive + negative + neutral === 0) return <></>;

  return (
    <HStack>
      <IoChatbubbleEllipsesOutline size="1.2rem" />
      <ResponsiveText>{t("Отзывы: ", "Reviews: ")}</ResponsiveText>
      <ResponsiveText color="green.400" mr="-1">
        {positive}
      </ResponsiveText>
      <Icon as={MdSentimentSatisfiedAlt} color="green.300" w="4" h="4" mb="1" />

      <ResponsiveText>/</ResponsiveText>
      <ResponsiveText mr="-1">{neutral}</ResponsiveText>
      <Icon
        as={MdOutlineSentimentNeutral}
        color="gray.400"
        w="4"
        h="4"
        mb="1"
      />

      <ResponsiveText>/</ResponsiveText>
      <ResponsiveText color="red.400" mr="-1">
        {negative}
      </ResponsiveText>
      <Icon
        as={MdSentimentVeryDissatisfied}
        color="red.400"
        w="4"
        h="4"
        mb="1"
      />
    </HStack>
  );
};

export default ReviewsStats;
