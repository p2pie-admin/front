import { Button } from "@chakra-ui/react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const LeaveReviewButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    w={{ base: "auto", lg: "auto" }}
    minW={{ base: "fit-content", lg: "fit-content" }}
    flexShrink={0}
    variant="no_contrast"
    rightIcon={<IoChatbubbleEllipsesOutline size="1.2rem" />}
    ml="auto"
    onClick={onClick}
  >
    Оставить отзыв
  </Button>
);

export default LeaveReviewButton;
