import { Flex } from "@chakra-ui/react";
import { addSpaces } from "../../../../redux/amountsHelper";
import { IExchangerReview } from "../../../../types/exchanger";

import ReserveStats from "./ReserveStats";
import ReviewsStats from "./ReviewsStats";
import WorkingTimeStats from "./WorkingTimeStats";
import { ResponsiveText } from "../../../../styles/theme/custom";

type Props = {
  reviews?: IExchangerReview[] | null;
  ratesTotal?: number | null;
  reserveTotal?: number | null | string;
  workingTime?: string | null;
};

const ExchangerStats = ({ reviews, reserveTotal, workingTime }: Props) => {
  if (!reviews) return <></>;

  return (
    <Flex
      flexDir={{ base: "column", lg: "row" }}
      color="bg.200"
      justifyContent="space-between"
      gap="4"
    >
      <ReviewsStats reviews={reviews} />
      <ResponsiveText display={{ base: "none", lg: "flex" }}>•</ResponsiveText>
      <WorkingTimeStats workingTime={workingTime} />
      <ResponsiveText display={{ base: "none", lg: "flex" }}>•</ResponsiveText>
      <ReserveStats
        reserveTotal={reserveTotal ? addSpaces(reserveTotal) : null}
      />
    </Flex>
  );
};

export default ExchangerStats;
