import { Button, Icon } from "@chakra-ui/react";
import NextLink from "next/link";

const LinkButton = ({
  href,
  message,
  bgColor = "bg.500",
  CustomIcon,
}: {
  href: string;
  message: string;
  bgColor?: string;
  CustomIcon?: any;
}) => {
  return (
    <NextLink href={href || ""}>
      <Button
        size="sm"
        bgColor={bgColor}
        my="1"
        rightIcon={<Icon as={CustomIcon} w="8" h="8" />}
      >
        {message}
      </Button>
    </NextLink>
  );
};

export default LinkButton;
