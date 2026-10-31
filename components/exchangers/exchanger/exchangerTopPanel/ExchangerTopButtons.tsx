import { Box, Button, Grid, HStack } from "@chakra-ui/react";

import { LEAVE_REVIEW_SECTION_ID } from "../leaveReview";
import ExchangeButton from "./ExchangeButton";
import LeaveReviewButton from "./LeaveReviewButton";
import { IExchanger } from "../../../../types/exchanger";
import { useT } from "../../../../services/i18n";

// down: our monitoring can't reach the exchanger's rates, so we don't send people there.
export const ExchangerTopButtons = ({ ref_link, down = false }: { ref_link: string; down?: boolean }) => {
  const t = useT();
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
    <>
      <LeaveReviewButton onClick={handleScrollToLeaveReview} />
      {down ? (
        <Button w="100%" isDisabled title={t("Курсы обменника сейчас не отвечают", "The exchanger's rates are not responding")}>
          {t("Не отвечает", "Not responding")}
        </Button>
      ) : (
        <ExchangeButton refLink={ref_link} fullWidth />
      )}
    </>
  );
};
