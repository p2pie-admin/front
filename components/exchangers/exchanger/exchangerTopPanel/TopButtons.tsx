import { Box, Grid, HStack } from "@chakra-ui/react";

import { LEAVE_REVIEW_SECTION_ID } from "../leaveReview";
import ExchangeButton from "./ExchangeButton";
import LeaveReviewButton from "./LeaveReviewButton";
import { IExchanger } from "../../../../types/exchanger";

export const TopButtons = ({ exchanger }: { exchanger: IExchanger }) => {
  const handleScrollToLeaveReview = () => {
    if (typeof window === "undefined") return;
    const target = document.getElementById(LEAVE_REVIEW_SECTION_ID);
    if (target) {
      const rect = target.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(absoluteTop - 100, 0),
        behavior: "smooth",
      });
      return;
    }
    const scrollHeight =
      document.documentElement?.scrollHeight ?? document.body.scrollHeight ?? 0;
    window.scrollTo({
      top: Math.max(scrollHeight - 100, 0),
      behavior: "smooth",
    });
  };

  return (
    <Box
      display={{ base: "grid", lg: "grid" }}
      gap="4"
      gridTemplateColumns="1fr 1fr"
    >
      <LeaveReviewButton onClick={handleScrollToLeaveReview} />
      <ExchangeButton refLink={exchanger.ref_link} fullWidth />
    </Box>
  );
};
