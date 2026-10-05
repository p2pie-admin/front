import { HStack, Icon } from "@chakra-ui/react";
import {
  MdOutlineSentimentNeutral,
  MdSentimentSatisfiedAlt,
  MdSentimentVeryDissatisfied,
} from "react-icons/md";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { ResponsiveText } from "../../../../styles/theme/custom";
import { IExchangerReview } from "../../../../types/exchanger";

// Exact totals (from the CMS) win over counting the (capped) list.
const ReviewsStats = ({ reviews, counts }: { reviews?: IExchangerReview[] | null; counts?: { positive: number; neutral: number; negative: number } | null }) => {
  if (!counts && (!reviews || !reviews.length)) return <></>;
  const positive = counts ? counts.positive : reviews!.filter((r) => r.type === "positive").length;
  const negative = counts ? counts.negative : reviews!.filter((r) => r.type === "negative").length;
  const neutral = counts ? counts.neutral : reviews!.length - positive - negative;
  if (positive + negative + neutral === 0) return <></>;

  return (
    <HStack>
      <IoChatbubbleEllipsesOutline size="1.2rem" />
      <ResponsiveText>Отзывы: </ResponsiveText>
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
