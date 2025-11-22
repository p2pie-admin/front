import { Button } from "@chakra-ui/react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const LeaveReviewButton = ({ onClick }: { onClick: () => void }) => (
  <Button
    w="100%"
    variant="no_contrast"
    rightIcon={<IoChatbubbleEllipsesOutline size="1.2rem" />}
    onClick={onClick}
  >
    Оставить отзыв
  </Button>
);

export default LeaveReviewButton;
