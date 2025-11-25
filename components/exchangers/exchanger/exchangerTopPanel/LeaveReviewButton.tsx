import { Button } from "@chakra-ui/react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const LeaveReviewButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    w={{ lg: "unset", base: "100%" }}
    variant={{ lg: "no_contrast", base: "extra_contrast" }}
    rightIcon={<IoChatbubbleEllipsesOutline size="1.2rem" />}
    onClick={onClick}
  >
    Оставить отзыв
  </Button>
);

export default LeaveReviewButton;
