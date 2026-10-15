import { Button } from "@chakra-ui/react";
import { LEAVE_REVIEW_SECTION_ID } from "../../../exchangers/exchanger/leaveReview";
import LeaveReviewButton from "../../../exchangers/exchanger/exchangerTopPanel/LeaveReviewButton";
import { scrollToMakerOffers } from "../offers";
import { useT } from "../../../../services/i18n";

// Makers are reached only through the p2pie bot, so the main action leads to the offers, not to Telegram.
export default function MakerTopButtons() {
  const t = useT();
  const scrollToReview = () => {
    const target = typeof window !== "undefined" ? document.getElementById(LEAVE_REVIEW_SECTION_ID) : null;
    if (target) window.scrollTo({ top: Math.max(target.getBoundingClientRect().top + window.pageYOffset - 100, 0), behavior: "smooth" });
  };
  return (
    <>
      <LeaveReviewButton onClick={scrollToReview} />
      <Button variant="primary" onClick={scrollToMakerOffers}>
        {t("Начать сделку", "Start a deal")}
      </Button>
    </>
  );
}
