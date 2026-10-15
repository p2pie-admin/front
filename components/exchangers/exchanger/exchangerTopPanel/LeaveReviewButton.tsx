import { Button } from "@chakra-ui/react";
import { TbPencilPlus } from "react-icons/tb";
import { useT } from "../../../../services/i18n";

const LeaveReviewButton = ({ onClick }: { onClick: () => void }) => {
  const t = useT();
  return (
  <Button
    w={{ lg: "unset", base: "100%" }}
    variant={{ lg: "no_contrast", base: "extra_contrast" }}
    rightIcon={<TbPencilPlus size="1.2rem" />}
    onClick={onClick}
  >
    {t("Оставить отзыв", "Leave a review")}
  </Button>
  );
};

export default LeaveReviewButton;
